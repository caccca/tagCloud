(function($, window){
	$.fn.tagCloud = function(config)
	{
		// 配置选项
		var opt = 
		{
			/* {wrapper}{helpBlock}{tag}{close} */
			helpBlock: {
				class: 'help-tag',
				tagName: 'p',
				id: 'help-tag-id',
			},
			wrapper: {
				class: 't-wrapper',
				tagName: 'div',
				id: 't-wrapper-id',
				contenteditable: true
			},
			tag: {
				class: 't-tag',
				tagName: 'span',
				contenteditable: false,
			},
			closeTag: {
				class: 't-close',
				tagName: 'span',
			},
			/*tag数量*/
			maxSize: 5,
			/*error*/

		},
		tagCloud = this,
		valueStore,err;
		opt = $.extend(opt, config);

		// 新建html标签方法
		var newTag = function(content, config)
		{
			var opt = 
			{
				tagName: 'span',
				css: {},
				class: '',
			}
			opt = $.extend(opt, config);
			var tagName = opt.tagName,css = opt.css,className = opt.class;
			delete(opt.tagName);
			delete(opt.css);
			delete(opt.class);
			return $('<'+tagName+'>').css(css).addClass(className).prop(opt).html(content);
		};

		var setValue = function(val)
		{
			valueStore.push(val);
			$(tagCloud).prop('value', valueStore);
		}

		var delValue = function(val)
		{
			var i = $.inArray(val, valueStore);

			if (i >=0) {
				valueStore.splice(i, 1);
				$(tagCloud).prop('value', valueStore);
			}
		}

		var showErr = function(msg)
		{
			$('#'+opt.helpBlock.id).html(msg);
		}

		// 初始化
		var init = function()
		{
			var t = $(tagCloud);
			if (t.prop('tagName') != 'INPUT' || t.children('input') == "undefined") 
			{
				console.log('标签类型错误! tag方法需要input标签.');
				return;
			}
			t.prop({name: 'TagCloud[]', hidden: true, value: []});
			console.log(tag);
			// 添加tag标签组
			t.after(newTag('', opt.wrapper));
			t.after(newTag('', opt.helpBlock));
			console.log(newTag('', opt.wrapper));
			valueStore = new Array();
			err = new Array();
		}

		/* @var e Event js事件对象 */
		var run = function(e)
		{
			if (e.keyCode == 32 || e.keyCode == 13 || e.type == 'blur')
			{
		
				var w = $(this),
					s = w.children(opt.tag.tagName).detach(),
					c = $.trim(w.text());

				if (s >= opt.maxSize)
				{
					showErr('最多设置'+opt.maxSize+'个标签.');
				}

				if ($.inArray(c, valueStore) >= 0)
				{
					showErr('重复的标签:'+c);
					c = null;
				}

				w.html('');
				if (c && s.length < opt.maxSize)
				{
					setValue(c);

					var t = newTag(c, opt.tag),
						closeTag = newTag('x', opt.closeTag);
					closeTag.click(function(){
						var pTag = $(this).parent();
						$(this).remove();
						var pVal = pTag.text();
						pTag.remove();
						delValue(pVal);
						
					})
					t.append(closeTag);
					w.append(t);
				}
				w.prepend(s);
			}
		}

		init();
		$('#'+opt.wrapper.id).on('keypress blur', run);
	}
})(jQuery,window);

