let page = 1; // Controla qué página se muestra

// Variables de la primera página
let img, imgWidth = 400, imgHeight = 400;
let imgOpacity = 255;
let textOpacity = 0;  // Comienza invisible
let imgSize = imgWidth;
let shrinking = false;
const duration = 45;
let textSizeValue = 48;  // Ajuste de tamaño de texto
let imgX, imgY;

// Variables de la segunda página
let images = [];
let moving = false;
let scrollSpeed = 1.6;
let isPaused = false;
let overlayDiv = null; // Overlay global

function preload() {
  img = loadImage("650a0418-dca4-46fd-b60b-2093550c281f.jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);

  // Coordenadas de la imagen en la primera página
  imgX = width / 2;
  imgY = height / 2 - 50;
}

function draw() {
  background(255);
  
  if (page === 1) {
    drawFirstPage();
  } else if (page === 2) {
    drawSecondPage();
  }
}

// 📌 Primera Página
function drawFirstPage() {
  fill(0);
  textSize(239);
  text("FOTÓGRAFOS", width / 2, height);

  imageMode(CENTER);

  // 📌 Mantener la proporción original de la imagen y aumentar su tamaño
  let aspectRatio = img.width / img.height; 
  let newHeight = imgHeight * 1.4; // Aumentamos el tamaño en un 30%
  let newWidth = newHeight * aspectRatio; // Calculamos el ancho basado en el alto

  if (shrinking) {
    imgSize -= (imgWidth / duration);
    imgOpacity -= (255 / (duration / 1.5));
    
    imgSize = max(imgSize, 0);
    imgOpacity = max(imgOpacity, 0);
  }

  if (imgOpacity > 0) {
    tint(255, imgOpacity);
    image(img, imgX, imgY, newWidth, newHeight);
    noTint();
  }

  // 📌 Ahora dibujamos el texto ENCIMA de la imagen
  fill(0, textOpacity);  // Texto en color negro
  textSize(textSizeValue);
  text("JOSEP MARTÍNEZ PEDRO", width / 2, 150); // Ajustamos la posición en la parte superior del lienzo
}

// 📌 Segunda Página
function drawSecondPage() {
  fill(0, 0, 0, 10);
  textSize(150);
  text("JOSEP MARTÍNEZ PEDRO", width / 2, 150);
  
  textSize(275);
  text("FOTÓGRAFOS", width / 2, height - 20);

  if (moving && !isPaused) {
    for (let imgObj of images) {
      imgObj.baseX -= scrollSpeed;
      if (imgObj.baseX < -500) imgObj.baseX = width;
      imgObj.element.position(imgObj.baseX, height / 2 - imgObj.element.height / 2);
    }
  }

  fill(0);
  rect(50, 50, 100, 50);
  fill(255);
  textSize(20);
  text("Volver", 100, 80);
}

// 📌 Clics para cambiar de página
function mousePressed() {
  if (page === 1) {
    let imgX = width / 2, imgY = height / 2 - 50;
    
    if (dist(mouseX, mouseY, imgX, imgY) < imgSize / 2) {
      page = 2;
      moving = true;
      loadCarouselImages();
    }

  } else if (page === 2) {
    if (mouseX > 50 && mouseX < 150 && mouseY > 50 && mouseY < 100) {
      page = 1;
      moving = false;
      images.forEach(imgObj => imgObj.element.remove());
      images = [];
      if (overlayDiv) {
        overlayDiv.remove();
        overlayDiv = null;
      }
    }
  }
}

// 📌 Cargar imágenes del carrusel
function loadCarouselImages() {
  let imagePaths = [
    'Captura de pantalla 2025-02-26 154104.png',
    'Captura de pantalla 2025-02-26 162627.png',
    'Captura de pantalla 2025-02-26 162956.png',
    'Captura de pantalla 2025-02-26 163023.png',
    'Captura de pantalla 2025-02-26 163032.png'
  ];
  
  let spacing = 450, margin = 100;
  let imageWidth = 0.22 * width;

  for (let i = 0; i < imagePaths.length; i++) {
    let imgElement = createImg(imagePaths[i], 'Imagen interactiva');
    imgElement.class('image-style');
    imgElement.size(imageWidth, imageWidth);
    imgElement.position(i * spacing + margin, height / 2 - imageWidth / 2);
    imgElement.mousePressed(() => toggleOverlay(imgElement, i));
    images.push({ element: imgElement, baseX: i * spacing + margin, zIndex: 2 });
  }
}

// 📌 Alternar overlay y traer la imagen al frente
function toggleOverlay(imgElement, index) {
  let isActive = imgElement.elt.classList.contains('clicked');

  if (isActive) {
    isPaused = false;
    imgElement.elt.classList.remove('clicked');
    if (overlayDiv) {
      overlayDiv.remove();
      overlayDiv = null;
    }
  } else {
    isPaused = true;

    if (overlayDiv) {
      overlayDiv.remove();
    }

    overlayDiv = createDiv();
    overlayDiv.class('overlay');
    overlayDiv.position(0, 0);
    overlayDiv.size(windowWidth, windowHeight);
    overlayDiv.style('background', 'rgba(0, 0, 0, 0.5)');
    overlayDiv.style('position', 'fixed');
    overlayDiv.style('z-index', '5');

    images.forEach((imgObj, i) => {
      imgObj.element.style('z-index', i === index ? '10' : '1');
      imgObj.element.elt.classList.remove('clicked');
    });

    imgElement.elt.classList.add('clicked');
  }
}

// 📌 Detectar cuando el ratón se mueve sobre la imagen
function mouseMoved() {
  let imgWidthScaled = imgWidth * 1.3;
  let imgHeightScaled = imgHeight * 1.3;
  let imgLeft = imgX - imgWidthScaled / 2;
  let imgRight = imgX + imgWidthScaled / 2;
  let imgTop = imgY - imgHeightScaled / 2;
  let imgBottom = imgY + imgHeightScaled / 2;

  // Comprobamos si el ratón está sobre la imagen
  if (mouseX > imgLeft && mouseX < imgRight && mouseY > imgTop && mouseY < imgBottom) {
    // Aumentamos la opacidad del texto progresivamente
    if (textOpacity < 255) {
      textOpacity += 30;  // Incremento rápido de la opacidad
    }
  } else {
    // Si el ratón sale de la imagen, el texto vuelve a ser invisible
    if (textOpacity > 0) {
      textOpacity -= 30;  // Decrecimiento rápido de la opacidad
    }
  }
}
