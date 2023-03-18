const labelMap = { 
    1:{name:'Book', color:'red'},
    2:{name:'Cocacola', color:'yellow'},
    3:{name:'Eraser', color:'lime'},
    4:{name:'Pen', color:'blue'},
    5:{name:'Scissors', color:'purple'},
}

export const drawRect = (boxes, classes , scores, threshold, imgWidth, imgHeight, ctx,setName)=>{
    for (let i=0 ; i<=boxes.length; i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            const [y , x , height , width] = boxes[i]
            const text = classes[i]
            
            ctx.strokeStyle = labelMap[text]['color']
            ctx.linewidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'      
            
            ctx.beginPath()
            
            
            setName(labelMap[text]['name'])    
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
            ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
            ctx.stroke()
        }
    }
}
