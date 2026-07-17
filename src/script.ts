import './index.css';
import { albuns } from './dados';

// Cole a URL gerada no Google Apps Script aqui dentro das aspas:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxv2pPiIHnSddGkR6bq45Xdc6xpELlN270TIdhHL0Kgfv161o_ZgZljJEIxz0dzWFLn/exec';

// Função mágica para contornar o erro de CORS (Bloqueio do Navegador) usando JSONP
function fetchJSONP(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    const script = document.createElement('script');
    
    // O Apps Script precisa suportar a leitura desse parâmetro ?callback=
    script.src = `${url}?callback=${callbackName}`;
    
    (window as any)[callbackName] = (data: any) => {
      resolve(data);
      script.remove();
      delete (window as any)[callbackName];
    };
    
    script.onerror = () => {
      reject(new Error('Erro no JSONP'));
      script.remove();
      delete (window as any)[callbackName];
    };
    
    document.body.appendChild(script);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // --- Intersection Observer for animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- Mobile Menu Logic ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // --- Lightbox Modal Logic ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;

  function openLightbox(imgSrc: string) {
    if (lightboxModal && lightboxImage) {
      lightboxImage.src = imgSrc;
      lightboxModal.classList.remove('opacity-0', 'pointer-events-none');
    }
  }

  function closeLightbox() {
    if (lightboxModal && lightboxImage) {
      lightboxModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => { lightboxImage.src = ''; }, 300);
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('pointer-events-none');
      
      const svg = mobileMenuBtn.querySelector('svg');
      if (svg) {
        if (mobileMenu.classList.contains('opacity-0')) {
          svg.innerHTML = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
        } else {
          svg.innerHTML = '<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>';
        }
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0');
        mobileMenu.classList.add('pointer-events-none');
        const svg = mobileMenuBtn.querySelector('svg');
        if (svg) {
          svg.innerHTML = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
        }
      });
    });
  }

  // Header scroll logic removido

  // --- Portfólio / Álbuns Logic ---
  const albumsContainer = document.getElementById('albums-container');
  const galleryContainer = document.getElementById('gallery-container');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryTitle = document.getElementById('gallery-title');
  const backBtn = document.getElementById('back-to-albums');

  if (albumsContainer && galleryContainer && galleryGrid && galleryTitle && backBtn) {
    let todosAlbuns = [...albuns];

    if (APPS_SCRIPT_URL) {
      albumsContainer.innerHTML = `
        <div class="col-span-full text-center py-16 flex flex-col items-center justify-center space-y-6">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <div class="absolute inset-0 border-t-2 border-white/20 border-solid rounded-full animate-spin"></div>
            <div class="absolute inset-2 border-r-2 border-white/40 border-solid rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
            <div class="absolute inset-4 border-b-2 border-white border-solid rounded-full animate-spin" style="animation-duration: 2s;"></div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <p class="text-white text-[12px] uppercase tracking-[3px] font-semibold flex items-center gap-2">
              Sincronizando
              <span class="flex space-x-1">
                <span class="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                <span class="w-1 h-1 bg-white rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
                <span class="w-1 h-1 bg-white rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
              </span>
            </p>
            <p class="text-white/40 text-[10px] uppercase tracking-[2px]">Conectando ao Google Drive</p>
          </div>
        </div>
      `;
      try {
        // Agora usamos o JSONP ao invés do fetch normal
        const driveAlbuns = await fetchJSONP(APPS_SCRIPT_URL);
        
        // Função para corrigir URLs da API do Google Drive
        // (Google Drive bloqueou uc?export=view para <img> recentemente)
        const fixDriveUrl = (url: string) => {
          if (url && url.includes('drive.google.com/uc?export=view&id=')) {
             const id = url.split('id=')[1].split('&')[0];
             return `https://drive.google.com/thumbnail?id=${id}&sz=s1000`;
          }
          return url;
        };

        // Substitui os álbuns de exemplo pelos do Google Drive com as URLs corrigidas
        todosAlbuns = driveAlbuns.map((album: any) => ({
          ...album,
          coverImage: fixDriveUrl(album.coverImage),
          photos: album.photos ? album.photos.map(fixDriveUrl) : []
        }));
        
        albumsContainer.innerHTML = '';
      } catch (error) {
        console.error('Erro ao buscar do drive:', error);
        albumsContainer.innerHTML = `
          <div class="col-span-full text-center py-10 flex flex-col items-center gap-4">
            <p class="text-red-500/80 text-[13px] uppercase tracking-[1px]">Erro de Atualização Necessária no Apps Script!</p>
            <p class="text-white/60 text-[12px] max-w-md text-center">
              Para resolver o bloqueio (CORS), você precisa atualizar o código lá no Google Apps Script para o novo código que coloquei nas instruções. 
              <strong>Não se esqueça de Implantar uma Nova Versão!</strong>
            </p>
          </div>
        `;
        return;
      }
    }

    // 1. Lógica de Filtro
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Atualizar botões
        filterBtns.forEach(b => {
          b.classList.remove('text-white', 'border-white');
          b.classList.add('text-white/50', 'border-transparent');
        });
        
        const targetBtn = e.currentTarget as HTMLButtonElement;
        targetBtn.classList.remove('text-white/50', 'border-transparent');
        targetBtn.classList.add('text-white', 'border-white');
        
        currentFilter = targetBtn.dataset.filter || 'all';
        renderAlbums();
      });
    });

    // 2. Renderizar os álbuns
    function renderAlbums() {
      albumsContainer.innerHTML = '';
      
      const filteredAlbums = todosAlbuns.filter(album => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'photos') return album.photos && album.photos.length > 0;
        if (currentFilter === 'videos') return !!album.video;
        return true;
      });

      filteredAlbums.forEach((album, index) => {
        let finalCoverImage = album.coverImage;
        
        // Se não tem capa, mas tem vídeo, tentar extrair a thumb do youtube
        if (!finalCoverImage && album.video) {
          let videoId = '';
          if (album.video.includes('youtube.com/watch?v=')) {
            videoId = album.video.split('v=')[1].split('&')[0];
          } else if (album.video.includes('youtu.be/')) {
            videoId = album.video.split('youtu.be/')[1].split('?')[0];
          }
          if (videoId) {
            finalCoverImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          }
        }

        const albumCard = document.createElement('div');
        albumCard.className = 'group relative aspect-video bg-[#111] border border-white/10 flex items-end p-6 cursor-pointer overflow-hidden reveal';
        // Add a slight delay based on index
        const delayClass = index % 3 === 1 ? 'delay-100' : index % 3 === 2 ? 'delay-200' : '';
        if (delayClass) albumCard.classList.add(delayClass);
        
        const videoIdForFallback = album.video ? (album.video.includes('v=') ? album.video.split('v=')[1].split('&')[0] : (album.video.includes('youtu.be/') ? album.video.split('youtu.be/')[1].split('?')[0] : '')) : '';
        const fallbackScript = videoIdForFallback && !album.coverImage ? `this.onerror=null; this.src='https://img.youtube.com/vi/${videoIdForFallback}/mqdefault.jpg';` : '';

        albumCard.innerHTML = `
          ${finalCoverImage ? `<img src="${finalCoverImage}" alt="${album.title}" class="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" referrerpolicy="no-referrer" onerror="${fallbackScript}" />` : '<div class="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center text-white/50 text-[10px]">SEM CAPA</div>'}
          <div class="relative z-10">
            <span class="text-[12px] uppercase tracking-[1.5px] font-semibold text-white bg-black/60 px-4 py-2 border border-white/10 backdrop-blur-md shadow-lg">0${index + 1}. ${album.title}</span>
          </div>
        `;

        // Evento de clique para abrir o álbum
        albumCard.addEventListener('click', () => {
          openAlbum(album.id);
        });

        albumsContainer.appendChild(albumCard);
        // Observe this dynamically generated element
        observer.observe(albumCard);
      });
      
      if (filteredAlbums.length === 0) {
        albumsContainer.innerHTML = `
          <div class="col-span-full text-center py-10">
            <p class="text-white/40 text-[13px] uppercase tracking-[1px]">Nenhum álbum encontrado nesta categoria.</p>
          </div>
        `;
      }
    }

    // Chamada inicial
    renderAlbums();

    // 3. Lógica de abrir e fechar álbum
    function openAlbum(albumId: string) {
      const album = todosAlbuns.find(a => a.id === albumId);
      if (!album) return;

      // Atualizar título e subtítulo
      galleryTitle!.textContent = album.title;
      const gallerySubtitle = document.getElementById('gallery-subtitle');
      if (album.subtitle && gallerySubtitle) {
        gallerySubtitle.textContent = album.subtitle;
        gallerySubtitle.classList.remove('hidden');
      } else if (gallerySubtitle) {
        gallerySubtitle.classList.add('hidden');
      }

      // Limpar grid de fotos
      galleryGrid!.innerHTML = '';
      galleryGrid!.className = 'w-full flex flex-col gap-[40px]';

      // 1. Adicionar Vídeo (se houver)
      if (album.video) {
        let videoUrl = album.video;
        // Transformar link padrão do youtube em embed se necessário
        if (videoUrl.includes('youtube.com/watch?v=')) {
          const videoId = videoUrl.split('v=')[1].split('&')[0];
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (videoUrl.includes('youtu.be/')) {
          const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'w-full flex items-center justify-center';

        const iframe = document.createElement('iframe');
        iframe.src = videoUrl;
        iframe.className = 'w-full max-w-4xl aspect-video bg-[#111] border border-white/10';
        iframe.allowFullscreen = true;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        
        videoWrapper.appendChild(iframe);
        galleryGrid!.appendChild(videoWrapper);
      }

      // 2. Adicionar Fotos (se houver)
      if (album.photos && album.photos.length > 0) {
        const masonryGrid = document.createElement('div');
        masonryGrid.className = 'masonry-grid w-full';
        
        album.photos.forEach((photoUrl, index) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'mb-[12px] break-inside-avoid reveal';
          const delayClass = index % 3 === 1 ? 'delay-100' : index % 3 === 2 ? 'delay-200' : '';
          if (delayClass) wrapper.classList.add(delayClass);
          
          const img = document.createElement('img');
          img.src = photoUrl;
          img.alt = `${album.title} - Foto ${index + 1}`;
          img.className = 'w-full bg-[#111] border border-white/10 cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl relative z-10';
          img.loading = 'lazy';
          img.referrerPolicy = 'no-referrer';
          img.addEventListener('click', () => openLightbox(photoUrl));
          
          wrapper.appendChild(img);
          masonryGrid.appendChild(wrapper);
          observer.observe(wrapper);
        });
        
        galleryGrid!.appendChild(masonryGrid);
      }

      // Transição de tela
      albumsContainer!.classList.add('hidden');
      galleryContainer!.classList.remove('hidden');
      
      // Scroll to top of portfolio section smoothly
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    }

    backBtn.addEventListener('click', () => {
      galleryContainer!.classList.add('hidden');
      albumsContainer!.classList.remove('hidden');
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Formulário de Contato Logic ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm && toast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Show toast
      toast.classList.remove('translate-y-24', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      // Hide toast after 5 seconds
      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
      }, 5000);
    });
  }
});
