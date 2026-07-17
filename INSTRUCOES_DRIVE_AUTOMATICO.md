# Como automatizar seu Portfólio com o Google Drive (100% Grátis)

Você não precisa pagar pela API do Google Drive nem usar o Sanity! A API do Drive é na verdade gratuita, mas configurar chaves de acesso dá dor de cabeça.

A forma mais incrível e fácil de fazer isso é usando o **Google Apps Script** (uma ferramenta gratuita do próprio Google que roda em nuvem). Ele vai ler a sua pasta do Drive que você mandou (`1Q400EhR4340VTQHZoYU-BG_aESbgn5Hv`) e enviar as fotos automaticamente para o site.

## Passo 1: Organize seu Drive
Abra a sua pasta principal no Google Drive (essa que você criou).
Dentro dela, **crie subpastas**. Cada subpasta será um Álbum.
*   Exemplo: Crie uma pasta chamada `Ensaio São Paulo` e coloque as fotos do ensaio dentro dela.
*   Crie outra pasta `Casamento` e coloque as fotos dentro dela.
*(O nome da subpasta vai virar o Título do álbum no site. Para definir a capa, nomeie a foto desejada como `capa` (ex: `capa.jpg` ou `capa_casamento.png`). Se não houver nenhuma foto com "capa" no nome, a primeira foto da pasta será a capa!)*

**NOVIDADE: Como adicionar Descrição (Subtítulo) ou Vídeo do YouTube:**
*   Para adicionar um subtítulo ao álbum, crie um arquivo de texto pelo Bloco de Notas ou pelo próprio Drive chamado **`descricao.txt`** e escreva o texto lá dentro. Coloque esse arquivo junto com as fotos na pasta do álbum!
*   Para adicionar um vídeo do YouTube no álbum, crie um arquivo de texto chamado **`youtube.txt`** (ou `video.txt`), cole o link do YouTube (ex: `https://www.youtube.com/watch?v=...`) e salve dentro da pasta.
*   Se o álbum **só tiver o arquivo do youtube e não tiver fotos**, não tem problema! O site vai extrair a thumb (capa) automaticamente do YouTube e mostrar o vídeo!

## Passo 2: Criar a Automação
1. Acesse o site: [script.google.com](https://script.google.com/) e faça login na sua conta do Google.
2. Clique no botão **"Novo Projeto"** no canto superior esquerdo.
3. Apague todo o código que estiver lá na tela e cole **exatamente este código abaixo** (atualizado para corrigir o erro de CORS!):

```javascript
function doGet(e) {
  // COLOQUE O ID DA SUA PASTA PRINCIPAL DO DRIVE AQUI:
  var folderId = '1Q400EhR4340VTQHZoYU-BG_aESbgn5Hv'; 
  
  var parentFolder = DriveApp.getFolderById(folderId);
  var folders = parentFolder.getFolders();
  var albuns = [];
  
  while (folders.hasNext()) {
    var folder = folders.next();
    var files = folder.getFiles();
    var photos = [];
    var coverImage = "";
    var subtitle = "";
    var video = "";
    
    while (files.hasNext()) {
      var file = files.next();
      var mimeType = file.getMimeType();
      var name = file.getName().toLowerCase();
      
      // Se for Imagem (Fotos e Capa)
      if (mimeType === MimeType.JPEG || mimeType === MimeType.PNG || mimeType === MimeType.GIF || mimeType === 'image/webp' || mimeType.indexOf('image/') !== -1) {
        // Usamos a API de thumbnail do Google Drive porque o 'uc?export=view' foi bloqueado recentemente para sites
        var url = "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=s1000";
        photos.push(url);
        
        // Se o nome do arquivo conter 'capa', define como capa oficial do álbum
        if (name.indexOf("capa") !== -1) {
          coverImage = url;
        } else if (coverImage === "") {
          // A primeira imagem vira a capa provisória se não achar nenhuma com 'capa'
          coverImage = url; 
        }
      } 
      // Se for arquivo de Texto (.txt)
      else if (mimeType === MimeType.PLAIN_TEXT || name.indexOf('.txt') !== -1) {
        var content = file.getBlob().getDataAsString();
        
        // Lê a descrição
        if (name.indexOf("descricao") !== -1 || name.indexOf("descrição") !== -1 || name.indexOf("subtitle") !== -1) {
          subtitle = content;
        } 
        // Lê o link do YouTube
        else if (name.indexOf("youtube") !== -1 || name.indexOf("video") !== -1) {
          video = content.trim();
        }
      }
    }
    
    // Adiciona o álbum na lista se tiver fotos ou um vídeo
    if (photos.length > 0 || video !== "") {
      albuns.push({
        id: folder.getId(),
        title: folder.getName(),
        subtitle: subtitle,
        coverImage: coverImage,
        photos: photos,
        video: video
      });
    }
  }
  
  var callback = e.parameter.callback;
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(albuns) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService.createTextOutput(JSON.stringify(albuns))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Passo 3: Colocar a Automação no Ar
1. No canto superior direito, clique no botão azul **"Implantar"** (ou Deploy) e escolha **"Nova implantação"** (SEMPRE escolha Nova implantação, nunca apenas "gerenciar").
2. Se você já tinha criado uma, clique no lápis de editar e mude a Versão para "Nova versão".
3. Preencha assim:
   *   **Descrição**: API Portfólio (Corrigida)
   *   **Executar como**: "Eu" (seu email)
   *   **Quem tem acesso**: Mude para **Qualquer pessoa** (Isso é obrigatório para o site conseguir ler).
4. Clique em **Implantar**. 
*(Ele vai pedir para "Autorizar acesso" à sua conta do Google, pois ele precisa ler a sua pasta do Drive. Pode clicar em "Permitir" e avançar nos avisos de segurança).*
5. No final, ele vai te dar um **URL do app da Web**. **Copie esse link!**

## Passo 4: Conectar ao seu Site
1. Volte aqui no código do seu site e abra o arquivo **`src/script.ts`**.
2. Lá na **linha 4**, você vai encontrar isso:
   `const APPS_SCRIPT_URL = '';`
3. Cole o link que você acabou de copiar dentro das aspas, ficando assim:
   `const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';`

## Mágica Feita! ✨
Pronto! Toda vez que o site carregar, ele vai buscar as informações direto da sua pasta do Google Drive.
Se você quiser adicionar um trabalho novo, é só entrar no Google Drive, criar uma subpasta nova, jogar as fotos dentro e... só isso! O site atualiza **sozinho**, sem você nunca mais precisar mexer em código e **100% de graça!**
