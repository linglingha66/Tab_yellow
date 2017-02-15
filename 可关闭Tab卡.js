/*
  2016.07.08 ver.01
  本插件用于Tab卡功能。
  要求：1、有标题
        2、有内容
        标题ul，标题高亮样式,内容ul,关闭按钮样式
*/
//获取Id
function getId(id_dom){
	return document.getElementById(id_dom);
}
//保留元素节点:把符合条件的元素节点放在一个数组里
function getNode(dom){
	var arr = [];
	for(var i=0;i<dom.length;i++){
		if(dom[i].nodeType == 1){
			arr.push(dom[i]);
		}
	}
	return arr;
}
//返回点击的位置,获取index值，即索引值
function getIndex(obj){
	var that = obj,count=0;//例：标题3
	while(that.previousSibling)//判断是否有标题2：即判断that前是否有别的元素
	{
		if(that.previousSibling.nodeType == 1){
			count++;
		}
		that = that.previousSibling;//把标题2给参照点	
	}
	return count;//此时返回2
}
//隐藏内容
function hide(dom){
	return dom.style.display="none";
}
//显示内容
function show(dom){
	return dom.style.display="block";
}
//获取类名不是“on”的元素节点的个数
function getClassNum(dom,on_name){
	var arr = [];
	for(var i=0;i<dom.length;i++){
		if(dom[i].className != on_name){
			arr.push(dom[i]);
		}
	}
	return arr.length;
}
//设置标题点击时样式
function setTitCss(dom,li_work){
	var dom;
	dom.className = li_work;
}
//获取兄弟节点,并进行操作
function getSibling(dom,opera){
	var dom = getNode(dom.parentNode.childNodes);
	for(var i=0;i<dom.length;i++){
		opera(dom[i]);
	}
}
//删除其余标题样式
function delTitCss(dom){
	var dom;
	dom.className = "";
}
//更新节点
function updateDom(dom){
	if(dom.id){
		return getId(dom.id);
	}
}
//点击显示相应标题下内容，隐藏其他标题下内容
function tab(li_dom,on_name,con_dom,close_name){
	var li_doms = getNode(li_dom.childNodes);
	var con_doms = getNode(con_dom.childNodes);
	for(var i=0;i<li_doms.length;i++){
		li_doms[i].onclick = function(){
			var count = getIndex(this);
			/*判断：是否点击的目标是"除了叉以外的标题部分"
			（即点击的目标节点名称为LI，而非A）*/
			if(event.target.nodeName == li_doms[count].nodeName){
				getSibling(this,delTitCss);//删除点击处所有兄弟节点的标题样式
				getSibling(con_doms[count],hide);//隐藏点击处所有兄弟节点的内容
				setTitCss(this,on_name);//将点击处的标题样式设为高亮
				show(con_doms[count]);//显示点击处的内容
			}
			
		}
	}
	close(li_dom,on_name,con_dom,close_name);
}
//删除函数
function close(li_dom,on_name,con_dom,close_name){
	var li_doms = getNode(li_dom.childNodes);//所有标题的li标签
	var con_doms = getNode(con_dom.childNodes);//所有内容的li标签
	for(var i=0;i<li_doms.length;i++){
		var li_sub_dom = li_doms[i].childNodes;//标题li标签下的子节点
		for(var k=0;k<li_sub_dom.length;k++){
			if(li_sub_dom[k].className == close_name)//找到标题li标签下的a标签
			{
				li_sub_dom[k].onclick = function(){
					//判断：点击的目标是否是“叉”
					if(event.target.className == close_name){
						var count = getIndex(this.parentNode);
						li_dom.removeChild(this.parentNode);//删除点叉处的标题li节点
						con_dom.removeChild(con_doms[count]);//删除点叉处的相应内容
						//更新删除后的dom结构，重新调用tab函数
						tab(updateDom(li_dom),on_name,updateDom(con_dom),close_name);
						/*如果（类名不是“on”的元素节点的个数）！=（元素节点的个数）
						  则删除其余标题后，仍然显示之前鼠标所点击的位置的内容和标题。
						  例：点击标题5，直接删除标题4，仍显示标题5的内容*/
						if(getClassNum(li_doms,on_name)!=li_doms.length){
							setTitCss(li_doms[count],on_name);
							show(con_doms[count]);
						}
	/*如果（类名不是“on”的元素节点的个数）=（元素节点的个数），即当所有元素节点
	的类名都不为“on”时，显示已关闭标题的前一个标题的内容，并将其标题样式设为高亮。*/
						if(getClassNum(li_doms,on_name)==li_doms.length-1){
							if(count>0){
								setTitCss(li_doms[count-1],on_name);
								show(con_doms[count-1]);
							}
							//如果关闭的是第一个标题，则显示关闭后的第一个标题及内容
							else{
								setTitCss(li_doms[0],on_name);
								show(con_doms[0]);
							}
						}

					}
				}
			}
		}
	}
}
