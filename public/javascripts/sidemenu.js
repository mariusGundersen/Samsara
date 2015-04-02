window.onload = function(){
  var PANEL_WIDTH = 200;
  var ICON_WIDTH = 35;
  
  var ACCELERATION = 2400;
  
  var pointer = null;
  var delta = 0;
  var draggers = document.querySelectorAll('.pane.menu');
  var paneElements = document.querySelectorAll('.pane');
  var panes = createPanes(paneElements, screenSize());
  
  window.addEventListener('resize', handleWindowResize, false);
  
  panes.filter(function(pane){
    return Array.prototype.indexOf.call(pane.element.classList, 'menu') != -1;
  }).forEach(function(dragger, index, draggers){
    dragger.element.querySelector("h2 a[href='#']").addEventListener('click', function(){
      handleMenuClicked(panes[panes.length - (2 + index)]);
    }, false);
    dragger.element.addEventListener('pointerdown', handlePointerDown, false);
  });
  document.body.addEventListener('pointermove', handlePointerMove, false);
  document.body.addEventListener('pointerup', handlePointerUp, false);
  document.body.addEventListener('pointerleave', handlePointerUp, false);
  document.body.addEventListener('pointercancel', handlePointerUp, false);
  
  document.querySelector('.content h2.dragger').addEventListener('pointerdown', handlePointerDown, false);
  
  function handleWindowResize(){
    panes = createPanes(paneElements, screenSize());
    delta = animateRepositionMenus(delta, 0);
  }
  
  function handlePointerDown(e){
    if(pointer == null && e.pointerType != "mouse"){
      pointer = {
        id: e.pointerId,
        startX: e.clientX - delta,
        startY: e.clientY,
        prevX: e.clientX,
        prevT: e.timeStamp
      };
    }
  }
  
  function handleMenuClicked(pane){
    if(delta == pane.maxPull){
      delta = 0;
    }else{
      delta = pane.maxPull;
    }
    delta = animateRepositionMenus(delta, 0);
  }
  
  function handlePointerMove(e){
    if(pointer && pointer.id === e.pointerId){
      var dx = e.clientX - pointer.startX;
      var dy = e.clientY - pointer.startY;
      if(!pointer.stable && Math.abs(dx-delta) < Math.abs(dy)){
        pointer = null;
        return;
      }else{
        pointer.stable = true;
        pointer.velocity = (e.clientX - pointer.prevX)/(e.timeStamp - pointer.prevT)*1000;
        pointer.prevX = e.clientX;
        pointer.prevT = e.timeStamp;
      }
      delta = repositionMenus(dx, false);
      e.preventDefault();
    }
  }
  
  function handlePointerUp(e){
    if(pointer && pointer.id === e.pointerId){
      var dx = e.clientX - pointer.startX;
      delta = animateRepositionMenus(dx, e.timeStamp - pointer.prevT>100 ? 0 : pointer.velocity);
      pointer = null;
    }
  }
  
  function animateRepositionMenus(dx, velocity){
    var size = screenSize();
    
    var t = Math.abs(velocity/ACCELERATION);
    var a = velocity > 0 ? -ACCELERATION : ACCELERATION;
    dx = dx + velocity*t + a/2*t*t;

    if(size == -1){
      //here be magic! this needs to be improved
      if(dx < PANEL_WIDTH/2){
        dx = 0;
      }else if(dx < (PANEL_WIDTH+ICON_WIDTH)+(PANEL_WIDTH-ICON_WIDTH)/2){
        dx = PANEL_WIDTH+Math.max(0, ICON_WIDTH*(panes.length-3));
      }else if(dx < (PANEL_WIDTH+ICON_WIDTH)+(PANEL_WIDTH-ICON_WIDTH)){
        dx = PANEL_WIDTH*2+Math.max(0, ICON_WIDTH*(panes.length-4));
      }else{
        dx = Math.ceil(Math.floor((dx-(PANEL_WIDTH+Math.max(0, ICON_WIDTH*(panes.length-3))))/((PANEL_WIDTH-ICON_WIDTH)/2))/2)*(PANEL_WIDTH-ICON_WIDTH)+(PANEL_WIDTH+Math.max(0, ICON_WIDTH*(panes.length-3)));
      }
      return repositionMenus(dx, true, velocity);
    }else{
      dx = Math.ceil(Math.floor(dx/((PANEL_WIDTH-ICON_WIDTH)/2))/2)*(PANEL_WIDTH-ICON_WIDTH);
      return repositionMenus(dx, true, velocity);
    }
  }
  
  function repositionMenus(delta, animate, velocity){
    var width = document.body.offsetWidth;
    var pulled = panes.reduce(function(pulled, pane){
      return spendPulledOnElement(pane, pulled, width, animate, velocity);
    }, Math.max(0, delta));
    
    return Math.max(0, delta - pulled);
  }

  function spendPulledOnElement(pane, pulled, width, animate, velocity){
    var maxTotalPull = Math.min(pane.maxPull, width - pane.rightEdge);
    var diff = translateElement(pane.element, Math.min(pulled, maxTotalPull));
    transitionElement(pane.element, animate ? diff : 0, velocity);
    var sub = Math.min(pane.marginLeft, maxTotalPull);
    return pulled < sub ? 0 : pulled - sub;
  }
  
  function translateElement(element, value){
    var now = /\((\d+)px/.exec(element.style.transform||element.style.webkitTransform);
    transform(element, value);
    return now ? now[1]-value : 0;
  }
  
  function transitionElement(element, value, velocity){
    if(value == 0){
      transition(element, 0);
    }else{
      var a = value > 0 ? ACCELERATION : -ACCELERATION;
      var b = velocity;
      var c = value;
      var r = b*b-4*a*c;
      var t = quadEq(2*a, b, r);
      transition(element, t);
    }
  }
    
  function quadEq(a2, b, r){
    if(r < 0){
      return 0.5;
    }
    
    var s = Math.sqrt(r);
    var t0 = (+s - b)/a2;
    var t1 = (-s - b)/a2;
    return t0<0 ? t1 : Math.min(t0, t1);
  }

  function screenSize(){
    return Math.floor(document.body.offsetWidth/1.5/PANEL_WIDTH)-2;
  }
  
  function createPanes(panes, size){
    var panes = Array.prototype.map.call(paneElements, function(a){return a});
  
    panes = panes.map(function(pane){
      return {
        element: pane,
        widthIcon: ICON_WIDTH,
        widthPane: PANEL_WIDTH,
        marginLeft: PANEL_WIDTH-ICON_WIDTH,
        maxPull: 0,
        leftEdge: 0
      };
    });

    if(size == -1 && panes.length > 2){
      panes[panes.length-2].widthIcon = -ICON_WIDTH*(panes.length-3);
    }

    panes.reduce(function(v, pane, index, panes){
      pane.marginLeft = index < (panes.length-size) ? Math.max(0, v.prevPaneWidth - pane.widthIcon) : 0;
      pane.element.style.marginLeft = "-"+pane.marginLeft+"px";
      pane.maxPull = v.sumMarginLeft + (index < (panes.length-size) ? pane.marginLeft : 0);
      pane.leftEdge = v.sumWidthIcon;
      return {
        sumMarginLeft: v.sumMarginLeft + pane.marginLeft,
        sumWidthIcon: v.sumWidthIcon + pane.widthIcon,
        prevPaneWidth: pane.widthPane
      };
    }, {
      sumMarginLeft:0, 
      sumWidthIcon:0,
      prevPaneWidth:0
    });

    panes.reverse();

    panes.reduce(function(widthIcons, pane){
      pane.rightEdge = pane.leftEdge + widthIcons + pane.widthIcon;
      widthIcons += ICON_WIDTH;
      return widthIcons;
    }, 0);
    
    return panes;
  }
  
  var transition = ('webkitTransition' in document.body.style) ? 
    function(element, t){
      element.style.webkitTransition = "-webkit-transform "+t+"s cubic-bezier(0.39, 0.77, 0.71, 1.0)";
    }
    :
    function(element, t){
      element.style.transition = "transform "+t+"s cubic-bezier(0.39, 0.77, 0.71, 1.0)";
    };
  var transform = ('webkitTransform' in document.body.style) ? 
    function(element, x){
      element.style.webkitTransform = "translate3d("+x+"px, 0, 0)";
    }
    :
    function(element, x){
      element.style.transform = "translate3d("+x+"px, 0, 0)";
    }
};