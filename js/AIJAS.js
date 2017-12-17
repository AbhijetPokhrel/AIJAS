

/*
 * _______________________________VIEW SECION___________________________________
 */

class View{
    
}

class Animation{
    
}
Animation.INFINIT=-1;

View.TRANSLATE_X = 1;
View.TRANSLATE_Y = 2;
View.ROTATE = 3;
View.ALPHA = 4;
View.SCALE=5;

//********************END VIEW SECTION*******************************************

/*
 * STRUCTURE of tracking the elems animations
 * {"elem_id":{MAPS of translates}}
 * 
 * STRUCTURE of tracking the maps of translation
 * {"percentage":{
 *                  translate:{x:val,y:val},
 *                  rotate:val deg,
 *                  opacity:val from 0 to 1
 *               }}
 */
var ACTIVE_ANIMATION={};//this variable stores the currently being played animation

class ValueAnimator{
    
    
    constructor(){
        this.animators=[];
        this.IS_ANIM_SET=false;
        this.interpolar=new LinearInterpolar();
        this.iteration=1;
    }
    
    
    setDuration(ms){
        this.duration =ms;
    }
    
    setInterpolar(intrplr){
        this.interpolar=intrplr;
    }
    setRepeatCount(count){
        this.iteration=count;
    }
    setAnimationListener(listener){
        this.anim_listener=listener;
    }
    
    start(){

        this.generateKeyFramesForMultipleAnims();
        this.generateKeyFrames();
        for(var anim_id in this.animations){
            this.animations[anim_id]['elem'].name=this.animations[anim_id]['anim_name'];
            this.animations[anim_id]['elem'].final_attr=this.animations[anim_id]['final_attr'];
            this.initialize(this.animations[anim_id]['elem']);
        }
        
    }
    
    /*
     * This function will generate appropriate keyfram css animation and 
     * adds them to the DOM
     * This is only used after all the elemensts coorsds ar tracked as frames
     */
    generateKeyFrames(){
        var prop;
        for(var anim_id in this.animations){
            
            var anim_name="AJAIS"+anim_id;
            var anims='';
            var final_attr='';
            
            for(var frame_per in this.animations[anim_id]["anim"]){
//                this.log("frame",frame_per);
                prop=this.animations[anim_id]["anim"][frame_per];
                // Adding translatoin
                final_attr='transform : translate(';
                final_attr+=prop.translate.x+"px";
                final_attr+=",";
                final_attr+=prop.translate.y+"px";
                final_attr+=") ";
                
                //Adding rotation
                final_attr+=" rotate("+prop.rotate+"deg )";
                
                //Adding scale anims
                final_attr+=" scale("+prop.scale+") rotateZ(0.001deg);";
                
                 //Adding opacity
                final_attr+=" opacity : "+prop.opacity;

                
                anims+="\n"+frame_per + " { "+final_attr+" } ";
            }
            
            this.animations[anim_id]["final_attr"]=final_attr;
            this.animations[anim_id]["anim_name"]=anim_name;
            
            anims="@-webkit-keyframes "+anim_name+"\n"+
                " {"+anims+"}\n\n"+
                "@keyframes "+anim_name+"\n"+
               " {"+anims+"}\n\n";
       
               //add the element to the animation
               var style=document.getElementById(anim_id);
               if(style!=undefined){
                   style.innerHTML=anims;
               }else{
                   document.getElementById("AIJAS_style").innerHTML+=
                       "<style type=\"text/css\" id=\""+anim_id+"\">"+anims+
                       "</style>";      
               }
            

        }
    } 
    
    /*
     * This function will generate appropriate keyfram css animation and 
     * adds them to the DOM
     * This is  used to track animation coordinates as framses
     */
    generateKeyFramesForMultipleAnims(){
        this.animations={};
        this.log("anims","total anims : "+this.animators.length);
        var key_frame_upto=0;//this variable will get the value between 0 to 1 for keyframs per animation
        var key_frame_from=0;//this variable will get the value between 0 to 1 for keyframs per animation
        var total_duration=this.getTotalDuration();
        for (var i=0;i<this.animators.length;i++){
            key_frame_from+=key_frame_upto;
            var anims=this.getAnimator(i);
            for(var i=0;i<anims.length;i++){
                    key_frame_upto=key_frame_from+(anims[i].duration/total_duration);
                    this.generateIndivisualParams(anims[i],key_frame_from,key_frame_upto);    
            }
        }
    }
    
    generateIndivisualParams(elem,key_frame_from,key_frame_upto){
        var dist=elem.to-elem.from;
        var per='';
        var id=elem.elem.dataset.styleId;
        var t0=key_frame_from;
        
        if(this.animations[id]==undefined){
            this.animations[id]={};
            this.animations[id]["elem"]=elem;
            this.animations[id]["anim"]={};
        }
       
        while(t0<=key_frame_upto){
            per=((t0*100).toFixed(2))+"%";
            if(this.animations[id]["anim"][per]==undefined){
                this.animations[id]["anim"][per]={
                    translate:{x:0,y:0,z:0},
                    rotate:0,
                    opacity:1,
                    scale:1
                };
            }
            if(elem.prop==View.TRANSLATE_X){
                 this.animations[id]["anim"][per]['translate'].x=
                         (elem.from+dist*elem.interpolar.getInterpolar(t0)).toFixed(0);
            }else if(elem.prop==View.TRANSLATE_Y){
                 this.animations[id]["anim"][per]['translate'].y=
                         (elem.from+dist*elem.interpolar.getInterpolar(t0)).toFixed(0);
            }
             else if(elem.prop==View.ROTATE){
                 this.animations[id]["anim"][per]["rotate"]=
                         (elem.from+dist*elem.interpolar.getInterpolar(t0)).toFixed(0);
            }
            else if(elem.prop==View.ALPHA){
                this.animations[id]["anim"][per]["opacity"]=
                        (elem.from+dist*elem.interpolar.getInterpolar(t0)).toFixed(3);
            }else if(elem.prop==View.SCALE){
                this.animations[id]["anim"][per]["scale"]=
                        (elem.from+dist*elem.interpolar.getInterpolar(t0)).toFixed(3);
            }
            t0 +=0.0025;
        }
//        this.log("animation",JSON.stringify(this.animations[id]["anim"]));
        
    }
    
    getAnimator(index){
        var animators=[];
        for(var i=0;i<this.animators.length;i++){
//            this.log("getAnimator","checking index: "+this.animators[i].index+" supplied :"+index);
            if(this.animators[i].index ==index){ animators.push(this.animators[i].elem);}
        }
//        this.log("getAnimator","total animators  of index: "+index+" = "+animators.length);
        return animators;
    }
    
    getTotalDuration(){
        var duration=0;
        var index=-1;
        var prev_duration=0;
        for(var i=0;i<this.animators.length;i++){
            if(this.animators[i].index>index){
                prev_duration=this.animators[i].elem.duration;
                duration+=prev_duration;
            }else if(this.animators[i].index==index){
                 duration+=Math.abs(this.animators[i].elem.duration-prev_duration);
                 prev_duration=(this.animators[i].elem.duration>prev_duration)?this.animators[i].elem.duration:prev_duration;
            }
            index=this.animators[i].index;
        }
//        this.log("getTotalDuration","total: "+duration);
        return duration;
    }
    
    initialize(elem){
            this.log("initialize","final attr : "+elem.final_attr);
            if(ACTIVE_ANIMATION[elem.elem.dataset.styleId]==undefined){
               ACTIVE_ANIMATION[elem.elem.dataset.styleId]={}; 
            }
            
            if(ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"]==undefined){
                this.log("initialize","new animation");
                this.addEventListeners(elem);//adding listernes for animation add only once
                setTimeout(this.setAnimPropertise(elem,this.iteration), 0);
            }else if(ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"]==false){
                this.log("initialize","registetring animation");
                setTimeout(this.setAnimPropertise(elem,this.iteration), 0)
            }
            else{
                this.log("initialize","interrupt animation");
                elem.elem.removeAttribute("style"); 
                elem.elem.setAttribute("style",elem.prev_style+";");
                this.refresh(elem.elem);
                elem.final_attr='';
                setTimeout(this.setAnimPropertise(elem,this.iteration), 1000)
            }
            
           

    }
    
    setAnimPropertise(elem,iteration){
        this.log("setAnimPropertise","init new anim prop");
        ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"]=true;
        //NOW SET THE NEW iNSTANCE
        ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]=this;

        elem.elem.style.animationName=elem.name;
        elem.elem.style.WebkitAnimationName=elem.name;
            
        elem.elem.style.animationDuration=elem.duration+"ms";
        elem.elem.style.WebkitAnimationDuration=elem.duration+"ms";
            
        elem.elem.style.WebkitAnimationFillMode = "forwards";  // Code for Chrome, Safari, and Opera
        elem.elem.style.animationFillMode = "forwards";
            
        if(this.iteration>1){
            elem.elem.style.WebkitAnimationIterationCount = iteration;  // Code for Chrome, Safari, and Opera
            elem.elem.style.animationIterationCount = iteration;
        }else if(this.iteration==-1){
            elem.elem.style.WebkitAnimationIterationCount = "infinite";  // Code for Chrome, Safari, and Opera
            elem.elem.style.animationIterationCount = "infinite";
        }else{
            elem.elem.style.WebkitAnimationIterationCount = null;  // Code for Chrome, Safari, and Opera
            elem.elem.style.animationIterationCount = null;
        }
            
    }
    
    addEventListeners(elem){
           
            elem.elem.addEventListener("webkitAnimationStart", function s(){
                ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                        .animationStart(elem.elem.dataset.styleId);
            });
            elem.elem.addEventListener("webkitAnimationIteration", function i(){
                 ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                        .animationRepeat(elem.elem.dataset.styleId);

            });
            elem.elem.addEventListener("webkitAnimationEnd", function e(){
                ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                        .animationEnd(elem.elem.dataset.styleId);

            });

            elem.elem.addEventListener("animationstart", function s(evt){
                ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                        .animationStart(elem.elem.dataset.styleId);
            });
            elem.elem.addEventListener("animationiteration", function i(){
                 ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                        .animationRepeat(elem.elem.dataset.styleId);
            });
            elem.elem.addEventListener("animationend", function e(evt){
                ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                        .animationEnd(elem.elem.dataset.styleId);
            });
    }
    
    refresh(elem){
        elem.style.animationName=null;
        elem.style.WebkitAnimationName=null;
            
        elem.style.animationDuration=null;
        elem.style.WebkitAnimationDuration=null;
            
        elem.style.WebkitAnimationFillMode = null;  // Code for Chrome, Safari, and Opera
        elem.style.animationFillMode = null;
            
        elem.style.WebkitAnimationIterationCount = null;  // Code for Chrome, Safari, and Opera
        elem.style.animationIterationCount = null;
        
        elem.elemoffsetHeight;
    }
    
    log(str,content){
//        console.log(str+" :: "+content);
    }
    
    animationStart(id){
       this.log("animstart","Start");
       if(this.anim_listener!=undefined){
           this.anim_listener.onAnimationStart(id);
       }
    }
    animationRepeat(id){
        this.log("animrepeat","Repeat");
        if(this.anim_listener!=undefined){
           this.anim_listener.onAnimationRepeat(id);
        }
    }
    animationEnd(id){
        var elem=this.animations[id]['elem'];
        if(ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"]!=undefined
                &&ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"]==true){
             this.log("animend","animation end"+elem.elem.dataset.styleId);
            elem.elem.removeAttribute("style"); 
            elem.elem.setAttribute("style",elem.prev_style+";/*--AIJAS__0__--*/"+elem.final_attr+"/*--AIJAS__1__--*/");
            this.log("anim","finally-- \nfinal:"+elem.final_attr+" \n prev style: "+elem.prev_style);
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"]=false; 
        }else{
            this.log("animend","non registered animation end");
        }
        
        if(this.anim_listener!=undefined){
           this.anim_listener.onAnimationEnd(id);
        }
             
    }
}


class ObjectAnimator extends ValueAnimator{
    
    constructor(){super();}
    
    static ofInt(elem,type,from,to){
      var anim=new ObjectAnimator();
      anim.animators=[];//here we add the animators and index of animation
      anim.from=from;
      anim.elem=elem;
      if(ACTIVE_ANIMATION[elem.dataset.styleId]!=undefined){
          if(ACTIVE_ANIMATION[elem.dataset.styleId]["is_active"]!=undefined){
              if(ACTIVE_ANIMATION[elem.dataset.styleId]["is_active"]==true){
                throw new ELEM_BUSY_EXCEPTION("Elem has on going animation");
              }
          }
      }
     
      
      /*replacing the previous used styles
       * The animation final attribure style starts with --AIJAS__0__-- as comment
       * and ends with --AIJAS__1__-- as comment
       * The value in between these comments are the styles generated from the previois
       * AIJAS animation
      */
      var prev_style=elem.getAttribute("style");
     
      if(prev_style!=undefined){
           var startKEY=";/*--AIJAS__0__--*/";
           var endKEY="/*--AIJAS__1__--*/";
           var start_index=prev_style.indexOf(startKEY);
           var end_index=prev_style.indexOf(endKEY)+endKEY.length;
           
           console.log("index start-index : "+start_index+" end-index : "+end_index);
           if(start_index!=1 && end_index!=-1){
                var replace=prev_style.substr(start_index,(end_index-start_index));
                prev_style=prev_style.replace(replace,'');
           }
           anim.prev_style=prev_style;
      }else{
          anim.prev_style='';
      }
      //---------------------------------------//
      anim.to=to;
      anim.prop=type;
      anim.animators.push({elem:anim,index:0});
      return anim;
    }
    
    static ofFloat(elem,type,from,to){
      return ObjectAnimator.ofInt(elem,type,from,to);
    }
   
    
}


class AnimatorSet extends ValueAnimator{
    
    constructor(){super();}
    
    playTogether(anims){
        var index=this.animators.length;
        this.log("AnimatorSet","anim index: "+index);
        for(var i=0;i<anims.length;i++){
            this.animators.push({elem:anims[i],index:index});
        }
    }
    
}



/*
 * _______________________________INTERPOLAT SECTION_________________________________
 * 
 *   
 * Intepolars define the way in which the timing function represent the 
 * entire animatiuon
 * we can also define our own interpolart
 */
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

class CycleInterpolator{
    
    constructor(cycle=2.0){this.cycle=cycle}
    
    getInterpolar(t){
        return Math.sin(2*Math.PI*this.cycle*t);
    }
}

class AccelerateInterpolator{
    
    constructor(factor=2.0){this.factor=factor;}
    getInterpolar(t){
       return Math.pow(t,2*this.factor);
    }
}

class OvershootInterpolar{
    
    constructor(tension=2.5){this.tension=tension;}
    getInterpolar(t){
        t -= 1.0;
        return t * t * ((this.tension + 1) * t + this.tension) + 1.0;
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

//***************************END Interpolar section**************************************//


//_________________________EXCEPOTIONS____________________________________

function ELEM_BUSY_EXCEPTION(message) {
   this.message = message;
   this.name = 'ELEM_BUSY_EXCEPTION';
}

