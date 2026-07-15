import './index.css';
import { albuns } from './dados';

document.addEventListener('DOMContentLoaded', () => {
  // --- Portfólio / Álbuns Logic ---
  const albumsContainer = document.getElementById('albums-container');
  const galleryContainer = document.getElementById('gallery-container');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryTitle = document.getElementById('gallery-title');
  const backBtn = document.getElementById('back-to-albums');

  if (albumsContainer && galleryContainer && galleryGrid && galleryTitle && backBtn) {
    // 1. Renderizar os álbuns
    albuns.forEach((album, index) => {
      const albumCard = document.createElement('div');
      albumCard.className = 'group relative aspect-square bg-[#111] border border-white/10 flex items-end p-[12px] cursor-pointer overflow-hidden';
      
      albumCard.innerHTML = `
        <img src="${album.coverImage}" alt="${album.title}" class="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" />
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
      const album = albuns.find(a => a.id === albumId);
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
