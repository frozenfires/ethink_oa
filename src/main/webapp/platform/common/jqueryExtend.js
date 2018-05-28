/**
 * 重写jquery方法
 */
(function (jQuery){
    // keep reference to the original $.fn.bind, $.fn.unbind and $.fn.find
    jQuery.fn.__text__ = jQuery.fn.text;
    jQuery.fn.__val__ = jQuery.fn.val;
    jQuery.fn.__html__ = jQuery.fn.html;
    jQuery.fn.__serializeArray__ = jQuery.fn.serializeArray;
    
    // a wrapper around of $.fn.find 
    // see more at: http://groups.google.com/group/jquery-en/browse_thread/thread/18f9825e8d22f18d
    jQuery.fn.text = function (value){
        if(this.hasClass("amt")){
          
            if(arguments.length > 0){
                try{
                  arguments[0] = Util.formatDou(value);
                }catch(e){
                  console.error(e, "格式化金额域错误");
                }
               return jQuery.fn.__text__.apply(this, arguments);//this.__text__(value);
            }else{
               var ret = jQuery.fn.__text__.apply(this, arguments);
               try{
                ret = Util.unformatDou(ret);
               }catch(e){
                  console.error(e, "反格式化金额域错误");
               }
               return ret;
            }
        }else{        
           // call jQuery original unbind
           return  jQuery.fn.__text__.apply(this, arguments);
        }
    };

    jQuery.fn.val = function (value){
        if(this.hasClass("amt")){
          if(arguments.length > 0){
                try{
                  arguments[0] = Util.formatDou(value);
                }catch(e){
                  console.error(e, "格式化金额域错误");
                }
               return jQuery.fn.__val__.apply(this, arguments);
            }else{
               var ret = jQuery.fn.__val__.apply(this, arguments);
               try{
                ret = Util.unformatDou(ret);
               }catch(e){
                  console.error(e, "反格式化金额域错误");
               }
               return ret;
            }
        }else{
           // call jQuery original unbind
           return jQuery.fn.__val__.apply(this, arguments);
        }
    };

  jQuery.fn.html = function (value){
      var ret = jQuery.fn.__html__.apply(this, arguments);
      if(value){
        ret.find(".amt").each(function(){
          var thisObj = $(this);
          if(thisObj.text() !== ''){
            thisObj.text(thisObj.text());
          }
          if(thisObj.val() !== ''){
            thisObj.val(thisObj.val());
          }          
        });
      }

      return ret;
  };

  jQuery.fn.dataValue = function(value){
    if(value){
      !this.hasClass('_data') ? this.addClass('_data') : '';
      this.data('value', value);
      return this;
    }
    else{
      return this.data('value');
    }
  }

  jQuery.fn.serializeArray = function(value){

    var 
      rCRLF = /\r?\n/g,
      rselectTextarea = /^(?:select|textarea)/i,
      rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;
    
    var retarray = this.map(function(){
      return this.elements ? jQuery.makeArray( this.elements ) : this;
    })
    .filter(function(){
      return (this.name !== '' || this.id !== '') && 
        ( this.checked || rselectTextarea.test( this.nodeName ) ||
          rinput.test( this.type ) );
    })
    .map(function( i, elem ){
      var val = jQuery( this ).val();
      if(jQuery( this ).hasClass("_data")){
        val = $(this).data('value');
      }
      var elemname = this.name !== '' ? this.name : this.id;

      return val == null ?
        null :
        jQuery.isArray( val ) ?
          jQuery.map( val, function( val, i ){
            return { name: elemname, value: val.replace( rCRLF, "\r\n" ) };
          }) :
          { name: elemname, value: val.replace( rCRLF, "\r\n" ) };
    }).get();

    this.find('.select').each(function(){
    	var val = $(this).attr('value');
    	if(val === '' ){
    		val += '';
    	}
      if($(this).attr('name') != '')
        retarray.push({name: $(this).attr('name'), value: val});
    });
    
    return retarray;
  }

  /**
   * 为下拉列表动态添加option选项
   */
  jQuery.fn.loadOption = function(items, keyname, valuename){
	    var target = this.find('.options'),
	      keyname = keyname || 'K',
	      valuename = valuename || 'V';
	    if(target.length > 0){
	      var optionhtml = [];
	      for(var i=0; i< items.length; i++){
	        var item = items[i];
	        optionhtml.push('<li><a href="javascript:void(0);" value="'+item[keyname]+'">'+item[valuename]+'</a></li>');
	        if(item.selected){
	          this.find('.item').text(item[valuename]);
	          this.attr('value', item[keyname])
	            .attr('text', item[valuename]);
	        }
	      }
	      target.html(optionhtml.join('\n'));
	    }
	    else if(this.prop('tagName') === 'SELECT'){
	      var optionhtml = [];
	      // 添加预留option
	      this.find('option[pin]').each(function(){
	        optionhtml.push(this.outerHTML);
	      });
	        
	      for(var i=0; i< items.length; i++){
	        var item = items[i];
	        if(item.selected){
	          optionhtml.push('<option value="'+item[keyname]+'" selected>'+item[valuename]+'</option>');
	        }
	        else{
	          optionhtml.push('<option value="'+item[keyname]+'">'+item[valuename]+'</option>');
	        }
	      }
	      this.html(optionhtml.join('\n'));
	    }

	    return this;
	  };
  /*jQuery.fn.loadOption = function(items, keyname, valuename){
    var target = this.find('.options'),
      keyname = keyname || 'K',
      valuename = valuename || 'V';
    if(target.length > 0){
      var optionhtml = [];
      for(var i=0; i< items.length; i++){
        var item = items[i];
        optionhtml.push('<li><a href="javascript:void(0);" value="'+item[keyname]+'">'+item[valuename]+'</a></li>');
        if(item.selected){
          this.find('.item').text(item[valuename]);
          this.attr('value', item[keyname])
            .attr('text', item[valuename]);
        }
      }
      target.html(optionhtml.join('\n'));
    }

    return this;
  };*/

  /**
   * 下拉列表设值
   */
  jQuery.fn.selectValue = function(){
    var value = arguments[0];
    if(value || value === ''){
      var selectObj = this,
        setName = '', setValue = '';

      selectObj.find('.options li a').each(function(){
        // console.debug('111111111111111');
        var oname=$(this).text(),
          ovalue = $(this).attr('value');
        // console.debug('ovalue='+ovalue+',oname='+oname);
        if(ovalue === value){
          setName =oname;
          setValue = ovalue;
        }
      });

      // console.debug('namej='+selectObj.attr('name')+ ',setName='+setName+',setValue='+setValue)
      selectObj.find('.item').text(setName);
      selectObj.attr('value', setValue)
            .attr('text', setName);
          
      return this;
    }else{

      return this.attr('value');
    }
  };

    return jQuery;
})(jQuery);