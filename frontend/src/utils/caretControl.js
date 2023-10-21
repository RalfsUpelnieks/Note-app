export const setCaretToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
};

export const getCaretCoordinates = (fromStart = true) => {
    let x, y;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection.rangeCount !== 0) {
        const range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();
        // For some reason if you set the caret using addRange() by calling the setCaretToEnd method
        // the range.getBoundingClientRect returns 0, adding temp zero width space fixes the problem
        if (rect.top===0 && rect.left===0) {
          let tmpNode = document.createTextNode('\ufeff');
          range.insertNode(tmpNode);
          rect = range.getBoundingClientRect();
          tmpNode.remove();
        }
        if (rect) {
          x = rect.left;
          y = rect.top;
        }
      }
    }
    return { x, y };
};

export const getSelection = (element) => {
    let selectionStart, selectionEnd;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const range = window.getSelection().getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(element);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      selectionStart = preSelectionRange.toString().length;
      selectionEnd = selectionStart + range.toString().length;
    }
    return { selectionStart, selectionEnd };
};