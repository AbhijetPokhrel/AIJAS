/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class View{
}

View.TRANSLATE_X = 1;
View.TRANSLATE_Y = 2;
View.ROTATE = 3;
View.ALPHA = 4;


class ValueAnimator{
    
    
    constructor(){
        this.IS_ANIM_SET=false;
        this.interpolar=new LinearInterpolar();
    }
    
    
    setDuration(ms){
        this.duration =ms;
    }
    
    setInterpolar(intrplr){
        this.interpolar=intrplr;
    }
    
    start(){
        
        if(!this.IS_ANIM_SET){
            
            this.animators.forEach(function(item){
                var name=item.elem.generateKeyFrames(item.elem); 
                item.elem.initialize(item.elem,name);
            });  
           
           
        }
        
    }
    
    generateKeyFrames(elem){
        var t0=0;
        var dist=this.to-this.from;
        var anim_name="AJAIS"+elem.elem.dataset.styleId;
       
        var anims='';
        
        var final_attr='';
        
        while(t0<=1){
//            this.log("t0",t0);
            if(elem.prop==View.TRANSLATE_X){
                final_attr="translate(" +
                        (this.from+dist*this.interpolar.getInterpolar(t0)).toFixed(0)+"px,0px)"+
                        " rotateZ(0.001deg);";
                
            }else if(elem.prop==View.TRANSLATE_Y){
                final_attr="translate(0px," +
                        (this.from+dist*this.interpolar.getInterpolar(t0)).toFixed(0)+"px)"+
                        " rotateZ(0.001deg);";
            }
            anims += ("\n"+(t0*100).toFixed(2))+"% "+"{ transform: "+final_attr+" } ";
            t0 +=0.0025;
        }
        this.final_attr=final_attr;
        anims="@-webkit-keyframes "+anim_name+"\n"+
                " {"+anims+"}\n\n"+
                "@keyframes "+anim_name+"\n"+
               " {"+anims+"}\n\n";
       
        
        //add the element to the animation
        document.getElementsByTagName('head')[0].innerHTML+=
                "<style type=\"text/css\" id=\""+elem.elem.dataset.styleId+"\">"+anims+
                "</style>";
                
        return anim_name;        
    } 
    
    initialize(elm,name){
        
            this.elem.addEventListener("webkitAnimationStart", function(){

            });
            this.elem.addEventListener("webkitAnimationIteration", function(){

            });
            this.elem.addEventListener("webkitAnimationEnd", function(){

            });

            this.elem.addEventListener("animationstart", function(evt){
                elm.animationStart(elm);
            });
            this.elem.addEventListener("animationiteration", function(){

            });
            this.elem.addEventListener("animationend", function(evt){
                elm.name=name;
                elm.animationEnd(elm);
            });

            this.elem.style.animationName=name;
            this.elem.style.WebkitAnimationName=name;
            
            this.elem.style.animationDuration=this.duration+"ms";
            this.elem.style.WebkitAnimationDuration=this.duration+"ms";
            
            this.elem.style.WebkitAnimationFillMode = "forwards";  // Code for Chrome, Safari, and Opera
            this.elem.style.animationFillMode = "forwards";

    }
    
    log(str,content){
        console.log(str+" :: "+content);
    }
    
    animationStart(elem){
       elem.log("anim","Start");
    }
    animationRepeat(){
        elem.log("anim","Repeat");
    }
    animationEnd(elem){
        
        var expiredAnim=document.getElementById(elem.elem.dataset.styleId);
        
        if(expiredAnim != undefined){//remove the prevous style syntax
            expiredAnim.outerHTML='';
        }
        elem.elem.style.animationName=null;
        elem.elem.style.WebkitAnimationName=null;
            
        elem.elem.style.animationDuration=null;
        elem.elem.style.WebkitAnimationDuration=null;;
        elem.log("anim","End attr -> "+elem.final_attr);
        
    }
}


class ObjectAnimator extends ValueAnimator{
    
    constructor(){super();}
    
    static ofInt(elem,type,from,to){
      var anim=new ObjectAnimator();
      anim.animators=[];//here we add the animators and index of animation
      anim.from=from;
      anim.elem=elem;
      anim.to=to;
      anim.prop=type;
      anim.animators.push({elem:anim,index:0});
      return anim;
    }
   
    
}

class LinearInterpolar{
    
    constructor(){}
    
    getInterpolar(t){
        return t;
    }
}

class AccelerateDecelerateInterpolator{
    
    constructor(){}
    
    getInterpolar(t){
       return (Math.cos((t + 1) * Math.PI) / 2.0) + 0.5;
    }
}

class BounceInterpolator{
    
    constructor(){}
    
    getInterpolar(t){
        t *= 1.1226;
        if (t < 0.3535) return this.bounce(t);
        else if (t < 0.7408) return this.bounce(t - 0.54719) + 0.7;
        else if (t < 0.9644) return this.bounce(t - 0.8526) + 0.9;
        else return this.bounce(t - 1.0435) + 0.95;
    }
    
    bounce(t) {
        return t * t * 8.0;
    }
}


