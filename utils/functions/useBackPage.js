const btnBackPage = document.querySelector('.header .btnBack i');
if (btnBackPage) {
    btnBackPage.addEventListener('click', () => {

        // Se há histórico dentro da sessão
        if (window.history.length > 1) {

            // Verifica se veio de outra página do mesmo site
            const referrer = document.referrer;

            if (referrer && referrer.includes(window.location.origin)) {
                history.back();
            }
            else {
                // Não volta se veio de fora ou não há página anterior válida
                console.log("Não há página anterior válida.");
            }

        } else {
            console.log("Não pode voltar.");
        }

    });
}