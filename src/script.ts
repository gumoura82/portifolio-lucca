import './index.css';
import { albuns } from './dados';

// Cole a URL gerada no Google Apps Script aqui dentro das aspas:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRORMK6C4H4V0bTrIzL3NpAHc3vrsNJqgpV5QeTUEf_6TarD-GyC8IYw96Z9lQlVJh/exec';

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
  // --- Portfólio / Álbuns Logic ---
  const albumsContainer = document.getElementById('albums-container');
  const galleryContainer = document.getElementById('gallery-container');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryTitle = document.getElementById('gallery-title');
  const backBtn = document.getElementById('back-to-albums');

  if (albumsContainer && galleryContainer && galleryGrid && galleryTitle && backBtn) {
    let todosAlbuns = [...albuns];

    if (APPS_SCRIPT_URL) {
      albumsContainer.innerHTML = '<p class="text-white/50 text-[13px] uppercase tracking-[1px] col-span-full text-center py-10">Sincronizando álbuns do Google Drive...</p>';
      try {
        // Agora usamos o JSONP ao invés do fetch normal
        const driveAlbuns = await fetchJSONP(APPS_SCRIPT_URL);
        
        // Função para corrigir URLs da API do Google Drive
        // (Google Drive bloqueou uc?export=view para <img> recentemente)
        const fixDriveUrl = (url: string) => {
          if (url && url.includes('drive.google.com/uc?export=view&id=')) {
             const id = url.split('id=')[1].split('&')[0];
             return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
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

    // 1. Renderizar os álbuns
    todosAlbuns.forEach((album, index) => {
      const albumCard = document.createElement('div');
      albumCard.className = 'group relative aspect-square bg-[#111] border border-white/10 flex items-end p-[12px] cursor-pointer overflow-hidden';
      
      albumCard.innerHTML = `
        <img src="${album.coverImage}" alt="${album.title}" class="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" referrerpolicy="no-referrer" />
        <div class="relative z-10">
          <span class="text-[11px] uppercase tracking-[1px] text-white bg-black/50 px-2 py-1 border border-white/10 backdrop-blur-sm">0${index + 1}. ${album.title}</span>
        </div>
      `;

      // Evento de clique para abrir o álbum
      albumCard.addEventListener('click', () => {
        openAlbum(album.id);
      });

      albumsContainer.appendChild(albumCard);
    });

    // 2. Lógica de abrir e fechar álbum
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
          wrapper.className = 'mb-[12px] break-inside-avoid';
          
          const img = document.createElement('img');
          img.src = photoUrl;
          img.alt = `${album.title} - Foto ${index + 1}`;
          img.className = 'w-full bg-[#111] border border-white/10';
          img.loading = 'lazy';
          img.referrerPolicy = 'no-referrer';
          
          wrapper.appendChild(img);
          masonryGrid.appendChild(wrapper);
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
