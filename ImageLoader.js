class ImageSource{constructor(src, x, y, width, height){
    
    this.image = new Image(width, height);
    this.image.src = src;
    this.x = x;
    this.y = y;
}}