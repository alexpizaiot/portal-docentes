const gapiLoad = () => {
    return new Promise( resolve => {
        gapi.load('client', ()=>{
            resolve();
        });
      console.log("gapi-utils: Biblioteca gapi carregada");
      })
  }
  
  const gapiClientInit = async (CLIENT_ID, SCOPES) => {
       try{
              await gapi.client.init({
                clientId: CLIENT_ID,
                scope: SCOPES,
            });
          console.log('gapi-utils: gapi inicializado.');
           return
         } catch (error){
           console.error("gapi-utils: Erro ao inicializar a API do Google", error);
         }
  }
  
  const gapiAuthSignOut = () => {
      google.accounts.id.disableAutoSelect();
      console.log("gapi-utils: Saindo da conta Google")
  }
  
  const gapiAuthRequestAccessToken = (tokenClient) => {
      return new Promise(resolve =>{
          tokenClient.callback = async (resp) => {
             if (resp.error !== undefined) {
                 throw (resp);
                }
                resolve(resp);
            };
          tokenClient.requestAccessToken();
         });
  }
  export {gapiLoad, gapiClientInit, gapiAuthSignOut, gapiAuthRequestAccessToken, gapi}