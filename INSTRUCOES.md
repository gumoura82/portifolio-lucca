# Como atualizar seu Portfólio (Guia para o Lucca)

Fala Lucca! Este site foi montado de um jeito que você não precisa ter dor de cabeça com HTML ou CSS para atualizar seus trabalhos. Tudo é controlado por um único arquivo.

## 1. Onde colocar os arquivos de imagem?
Se você for usar imagens do seu computador, crie uma pasta chamada `fotos` dentro da pasta `public` (o caminho ficará `public/fotos/`).
Coloque todas as suas fotos lá dentro (ex: `ensaio01.jpg`).

## 2. Onde eu edito os álbuns?
Abra o arquivo **`src/dados.ts`** no seu VS Code. É nele que mora todo o conteúdo do seu portfólio.

Lá dentro você vai encontrar uma lista chamada `albuns`. Cada bloco entre as chaves `{ ... }` é um álbum diferente.

---

## 3. Como adicionar um novo Álbum de Fotos?
Para adicionar um novo álbum, basta copiar um bloco existente, colar no final da lista, e preencher com suas informações:

```javascript
  {
    id: 'ensaio-urbano', // Um identificador único, sem espaços (use hífens)
    title: 'Ensaio Urbano SP', // O título principal do site
    subtitle: 'Fotos tiradas no centro', // (Opcional) Um subtítulo abaixo do título do álbum
    coverImage: './fotos/capa-urbana.jpg', // O caminho da foto de capa
    photos: [
      './fotos/foto1.jpg',
      './fotos/foto2.jpg'
      // Adicione quantas fotos quiser aqui
    ]
  }, // Não esqueça dessa vírgula no final se houver outro álbum depois!
```

---

## 4. Vídeos e Imagens Juntos!
Você pode misturar vídeos do YouTube e fotos no mesmo álbum tranquilamente. Se o álbum tiver as duas coisas, o vídeo vai aparecer em destaque no topo, e as fotos vão aparecer logo abaixo!

```javascript
  {
    id: 'meu-clipe-novo',
    title: 'Cinematic Reel 2024',
    subtitle: 'Making of e Resultado Final',
    coverImage: './fotos/capa-do-video.jpg', // Imagem que vai aparecer no grid inicial
    video: 'https://www.youtube.com/watch?v=SEU_LINK_DO_YOUTUBE', // Link do YouTube (Aparece no topo)
    photos: [
      './fotos/bastidores1.jpg', // Aparecem embaixo do vídeo
      './fotos/bastidores2.jpg'
    ]
  },
```

## Dicas de Ouro
1. **Vírgulas:** Preste atenção nas vírgulas! Toda linha (exceto a última de uma lista) e todo fechamento de álbum `},` precisa ter uma vírgula separando do próximo.
2. **Nomes de Arquivo:** Evite usar espaços ou caracteres especiais nos nomes das suas fotos (ex: prefira `foto-praia-01.jpg` ao invés de `foto praia 01!.jpg`).
3. **Links do YouTube:** Você pode colocar o link normal (aquele `watch?v=...`) ou o link curtinho de compartilhamento (`youtu.be/...`). O código do site já converte sozinho para o player!
