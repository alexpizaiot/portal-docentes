import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const auth = getAuth();
           try {
             console.log("dashboard.js: Iniciando o signout")
                signOut(auth).then(()=>{
                    console.log("dashboard.js: signout realizado com sucesso")
                    window.location.href = 'index.html';
                });
           } catch (error){
                console.error("dashboard.js: Erro ao sair:", error);
            }
        });

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) =>{
            e.preventDefault();
            const href = link.getAttribute("href");
            if (href !== "#"){
              if (href === "#controle-evasao"){
                 window.open("https://forms.office.com/r/fBNbhiYfsb", "_blank");
               } else {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({behavior: "smooth"});
              }
             }
            }
        });
    });

    const menuButton = document.createElement("button");
    menuButton.textContent = "☰"; // Ícone do menu
    menuButton.classList.add("btn", "btn-light", "d-md-none");
    document.querySelector("body").prepend(menuButton); // Adiciona o botão no topo da página

    const sidebar = document.getElementById("sidebar");

    menuButton.addEventListener("click", (event) => {
        event.stopPropagation(); // impede que o clique se propague para outros eventos
        sidebar.classList.toggle("active");
    });
    
    document.addEventListener('click', (event) => {
        if(!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });
});