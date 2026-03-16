const link = document.querySelectorAll('.header .header-container .nav-container ul li');
if (link.length > 0) {
    link.forEach((a) => {

        a.querySelector('a').onclick = () => {
            for (let i = 0; i < link.length; i++) {
                link[i].classList.remove('active');
            }
            a.classList.add('active')
            console.log(a);
        }
    })
}