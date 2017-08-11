(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.mde = factory());
}(this, (function () { 'use strict';

/**
 * 作用于 string 的类似 Array#splice 的方法
 * @param {string} str
 * @param {number} start
 * @param {number} remove
 * @param {string} [insertStr]
 * @return {string}
 */
function splice4string (str, start, remove, insertStr) {
  if ( insertStr === void 0 ) insertStr = '';

  var startString = str.slice(0, start);
  var endString = str.slice(start + remove);
  return startString + insertStr + endString
}

function wrapBy (str, start, end, wrapStr) {
  var result = splice4string(str, start, 0, wrapStr);
  result = splice4string(result, end + wrapStr.length, 0, wrapStr);

  return result
}

var MDE = (function () {
  function anonymous (el) {
    this.el = el;

    el.addEventListener('keypress', function (event) {
      console.log(event);
    });
  }

  /**
   * 获取当前编辑器的内容
   * @return {string}
   */
  anonymous.prototype.getValue = function getValue () {
    return this.el.value
  };

  /**
   * 设置当前编辑器的内容
   * @param {string} val
   */
  anonymous.prototype.setValue = function setValue (val) {
    this.el.value = val;
  };

  /**
   * 设置当前的选中范围
   * @param {number} start
   * @param {number} end
   */
  anonymous.prototype.setSelection = function setSelection (start, end) {
    this.el.focus();
    this.el.setSelectionRange(start, end);
  };

  /**
   * 获取编辑器当前选中区域的范围。如果没有选中文本，则 start 和 end 是相等的。
   * @return {{start: number, end:number}} - 如果是 number，说明当前编辑器没有选中内容，则此时返回光标的位置
   */
  anonymous.prototype.getSelection = function getSelection () {
    var ref = this.el;
    var selectionStart = ref.selectionStart;
    var selectionEnd = ref.selectionEnd;

    return {
      start: selectionStart,
      end: selectionEnd
    }
  };

  /**
   * 获取选中文本
   * @return {string}
   */
  anonymous.prototype.getSelectionText = function getSelectionText () {
    var pos = this.getSelection();
    if (typeof pos === 'object') {
      return this.getValue().slice(pos.start, pos.end)
    } else {
      return ''
    }
  };

  /**
   * 将当前选中文本用加粗语法包裹。
   * 如果编辑器没有选中文本，则在光标位置插入一段加粗提示。
   */
  anonymous.prototype.bold = function bold () {
    var ref = this.getSelection();
    var start = ref.start;
    var end = ref.end;
    var val = this.getValue();
    var selectionStart;
    var selectionEnd;
    if (start === end) {
      var tip = 'Bold Text';
      this.setValue(splice4string(val, end, 0, ("**" + tip + "**")));
      selectionStart = end + 2;
      selectionEnd = selectionStart + tip.length;
    } else {
      this.setValue(wrapBy(val, start, end, '**'));
      selectionStart = start + 2;
      selectionEnd = end + 2;
    }
    this.setSelection(selectionStart, selectionEnd);
  };

  return anonymous;
}());

var index = function (el) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }
  return new MDE(el || document.createElement('textarea'))
};

return index;

})));
