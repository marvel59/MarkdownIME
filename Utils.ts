namespace MarkdownIME.Utils {
	/**
	 * Move the cursor to the end of one element.
	 */
	export function move_cursor_to_end(ele : Node) {
		var selection = ele.ownerDocument.defaultView.getSelection();
		var range = ele.ownerDocument.createRange();
		var focusNode = ele;
		while (focusNode.nodeType == 1) {
			var children = [].filter.call(focusNode.childNodes, is_node_not_empty);
			var t = children[children.length - 1];
			if (!t) break;
			focusNode = t;
		}
		range.selectNode(focusNode);
		range.collapse(false);
		selection.removeAllRanges();
		selection.addRange(range);
	}
	
	/**
	 * Check if it's a BR or empty stuff.
	 */
	export function is_node_empty(node : Node) {
		return (node.nodeType == 3 && (
			node.nodeName == "BR" || /^[\s\r\n]*$/.test(node.nodeValue)
		))
	}
	
	/**
	 * revert is_node_empty()
	 */
	export function is_node_not_empty(node : Node) {
		return !is_node_empty(node);
	}
	
	/**
	 * Check if one node is a container for text line
	 */
	export function is_node_block(node : Node) {
		if (node.nodeType != 1) return false;
		return (/^(P|DIV|LI|H\d)$/.test(node.nodeName));
	}
	
	/**
	 * Check if one line container can be processed.
	 */
	export function is_line_container_clean(wrapper : Node) {
		var children : Array<Node> = [].filter.call(wrapper.childNodes, is_node_not_empty);
		var ci : number = children.length;
		if (ci == 1 && children[0].nodeType == 1) {
			//cracking nuts like <p><i><b>LEGACY</b></i></p>
			return is_line_container_clean(children[0]);
		}
		while (ci--) {
			var node = children[ci];
			if (node.nodeType == 3) continue;	//textNode pass
			return false;
		}
		return true;
	}
	
	/**
	 * Find the path to one certain container.
	 * @return {Array<Node>} 
	 */
	export function build_parent_list(node : Node, end : Node) : Array<Node> {
		var rtn : Array<Node> = [];
		var iter : Node = node;
		while (true) {
			iter = iter.parentNode;
			if (!iter) break;
			rtn.push(iter);
			if (iter == end) break;
		}
		return rtn;
	}
	
	/**
	 * text2html
	 */
	export function text2html(text : string) {
		return text.replace(/&/g, '&amp;').replace(/  /g, '&nbsp;&nbsp;').replace(/"/g, '&quot;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
	}
	
	/**
	 * help one element wear a wrapper
	 */
	export function wrap(wrapper : Node, node : Node) {
		node.parentNode.replaceChild(wrapper, node);
		wrapper.appendChild(node);
	}
}
