# Como automatizar seu Portfólio com o Google Drive (100% Grátis)

Você não precisa pagar pela API do Google Drive nem usar o Sanity! A API do Drive é na verdade gratuita, mas configurar chaves de acesso dá dor de cabeça.

A forma mais incrível e fácil de fazer isso é usando o **Google Apps Script** (uma ferramenta gratuita do próprio Google que roda em nuvem). Ele vai ler a sua pasta do Drive que você mandou (`1Q400EhR4340VTQHZoYU-BG_aESbgn5Hv`) e enviar as fotos automaticamente para o site.

## Passo 1: Organize seu Drive
Abra a sua pasta principal no Google Drive (essa que você criou).
Dentro dela, **crie subpastas**. Cada subpasta será um Álbum.
*   Exemplo: Crie uma pasta chamada `Ensaio São Paulo` e coloque as fotos do ensaio dentro dela.
*   Crie outra pasta `Casamento` e coloque as fotos dentro dela.
*(O nome da subpasta vai virar o Título do álbum no site, e a primeira foto vai virar a capa!)*

## Passo 2: Criar a Automação
1. Acesse o site: [script.google.com](https://script.google.com/) e faça login na sua conta do Google.
2. Clique no botão **"Novo Projeto"** no canto superior esquerdo.
3. Apague todo o código que estiver lá na tela e cole **exatamente este código abaixo** (atualizado para corrigir o erro de CORS!):

```javascript
function doGet(e) {
  // O ID da sua pasta de teste!
  var mainFolderId = '1Q400EhR4340VTQHZoYU-BG_aESbgn5Hv';
  
  var mainFolder = DriveApp.getFolderById(mainFolderId);
  var subFolders = mainFolder.getFolders();
  var albums = [];

  while (subFolders.hasNext()) {
    var subFolder = subFolders.next();
    var files = subFolder.getFiles();
    var photos = [];
    var coverImage = '';

    while (files.hasNext()) {
      var file = files.next();
      // Verifica se o arquivo é uma imagem
      if (file.getMimeType().indexOf('image/') !== -1) {
        // Usamos a API de thumbnail do Google Drive porque o 'uc?export=view' foi bloqueado recentemente para sites
        var url = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1000';
        photos.push(url);
        // A primeira foto da pasta vira a capa do álbum
        if (!coverImage) coverImage = url; 
      }
    }

    if (photos.length > 0) {
      albums.push({
        id: subFolder.getId(),
        title: subFolder.getName(),
        subtitle: 'Sincronizado via Google Drive',
        coverImage: coverImage,
        photos: photos
      });
    }
  }

  var output = JSON.stringify(albums);
  
  // TRUQUE MÁGICO PARA EVITAR ERRO DE "CORS" NO SEU SITE (JSONP)
  if (e.parameter.callback) {
    return ContentService.createTextOutput(e.parameter.callback + '(' + output + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Retorna JSON normal se não tiver callback
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
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
