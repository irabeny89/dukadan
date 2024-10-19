const anims = [...document.querySelectorAll("[anim]")];
console.log(anims);
const click = (el, cb) => el.addEventListener("click", cb);
const toggle = (el) => el.classList.toggle("toggled");
const clickTog = (el) => click(el, () => toggle(el));
anims.map(clickTog);
