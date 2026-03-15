//LOAD
const loader = document.querySelector(".load-area");
if (loader) {
  window.onload = () => {
    objLoad = {
      states: "on",
      date: Date.getDate
    };
    var dateLoad = JSON.parse(localStorage.getItem('load_page'));
    if (!dateLoad) {
      localStorage.setItem("load_page", JSON.stringify(objLoad));
      console.log(true);
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 2000);
    }else{
        console.log(false);
        setTimeout(() => {
        loader.classList.add("hidden");
      }, 1000);
    }                                                                                                                                                                                                                                                                              
  };
}
