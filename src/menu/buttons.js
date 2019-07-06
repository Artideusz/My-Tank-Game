function cBTN({
    text = 'Sample Text',
    image = null,
    font = '20px Impact',
    textColor = '#000',
    buttonColor = '#999',
    x = 0,
    y = 0,
    width = 100,
    height = 50,
    hidden = true,
    }={},callback)
{
    this.buttonElement = document.createElement('button');
    this.buttonElement.innerHTML = (image)?null:text;
    this.buttonElement.onclick = callback;
    this.buttonElement.style = `position:absolute;outline:none;display:${(hidden)?'none':'block'};font:${font};top:${y-height/2}px;left:${x-width/2}px;width:${width}px;height:${height}px;color:${textColor};background-color:${buttonColor};${(image)?'background-image:url('+image+')':null}`;
    document.body.appendChild(this.buttonElement);
}
