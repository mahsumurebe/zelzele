![Zelzele Logo](https://cdn.mahsumurebe.com/projects/zelzele/logo.svg)
  
## DESCRIPTION    
 Zezele is a service that broadcasts earthquake information over the socket.    
    
### Providers For Turkey: [KANDİLLİ RASATHANESİ VE DEPREM ARAŞTIRMA ENSTİTÜSÜ (KRDAE)](http://www.koeri.boun.edu.tr/scripts/lst4.asp)    
    
### Installation   
 1. Pull this repository and go to zelzele directory.  
  
```bash    
 git clone https://github.com/mahsumurebe/zelzele.git  
 cd zelzele
```  
2. Install node modules  
```bash  
npm install  
```  
3. Create .env file in project root directory  
```dotenv  
WS_SERVER_HOSTNAME=127.0.0.1 WS_SERVER_PORT=3000 WS_SERVER_HTTPS_USE=false WS_SERVER_HTTPS_CERT_FILE= WS_SERVER_HTTPS_PRIVATE_KEY_FILE=  
```  
5. Call start script  
```bash  
npm start  
```