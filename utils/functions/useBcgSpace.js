const starsContainer = document.querySelector(".stars");

const starsCount = 250;

function createStars(){

    for(let i=0;i<starsCount;i++){

        const star = document.createElement("div");
        star.className="particle-star";

        const size=Math.random()*0.5+0.5;
        const isRed=Math.random()>0.85;
        const speed=15+Math.random()*50;
        const startX=Math.random()*100;
        const startY=Math.random()*100;
        const opacity=0.3+Math.random()*0.7;
        const delay=Math.random()*-speed;

        star.style.cssText=`
        width:${size}px;
        height:${size}px;
        background:${isRed?"rgba(248, 248, 248, 0.9)":"white"};
        top:${startY}%;
        left:${startX}%;
        opacity:${opacity};
        box-shadow:0 0 ${size*2}px ${isRed?"rgba(255, 255, 255, 0.6)":"rgba(255,255,255,0.5)"};
        animation: moveParticle ${speed}s linear infinite,
                   twinkleParticle ${2+Math.random()*3}s ease-in-out infinite;
        animation-delay:${delay}s, ${Math.random()*2}s;
        `;

        starsContainer.appendChild(star);

    }

}

function createShootingStar(){

    const star=document.createElement("div");
    star.className="shooting-star";

    const startX=30+Math.random()*40;
    const startY=Math.random()*40;
    const isRed=Math.random()>0.5;

    star.style.cssText=`
    top:${startY}%;
    left:${startX}%;
    background:${isRed?"rgba(197,34,34,1)":"white"};
    box-shadow:
    0 0 10px ${isRed?"rgba(197,34,34,0.9)":"rgba(255,255,255,0.9)"},
    0 0 25px ${isRed?"rgba(197,34,34,0.5)":"rgba(255,255,255,0.5)"};
    animation: shootingStar ${1+Math.random()*0.5}s ease-out forwards;
    `;

    starsContainer.appendChild(star);

    setTimeout(()=>{

        star.remove();

    },1500);

}

createStars();

setInterval(()=>{

    if(Math.random()>0.7){

        createShootingStar();

    }

},2500);