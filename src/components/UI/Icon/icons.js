/* eslint import/no-webpack-loader-syntax: 0 */
/* eslint sort-imports: 'error' */
/* eslint sort-keys: 'error' */
import arrow from '!svg-sprite-loader!@/assets/icon-arrow.svg';
import arrowDouble from '!svg-sprite-loader!@/assets/icon-arrow-double.svg';
import backArrow from '!svg-sprite-loader!@/assets/icon-backarrow.svg';
import check from '!svg-sprite-loader!@/assets/icon-check.svg';
import close from '!svg-sprite-loader!@/assets/icon-close.svg';
import cross from '!svg-sprite-loader!@/assets/icon-cross.svg';
import editorBold from '!svg-sprite-loader!@/assets/editor/bold.svg';
import editorChecklist from '!svg-sprite-loader!@/assets/editor/checklist.svg';
import editorCode from '!svg-sprite-loader!@/assets/editor/code.svg';
import editorHr from '!svg-sprite-loader!@/assets/editor/hr.svg';
import editorImage from '!svg-sprite-loader!@/assets/editor/image.svg';
import editorItalic from '!svg-sprite-loader!@/assets/editor/italic.svg';
import editorLink from '!svg-sprite-loader!@/assets/editor/link.svg';
import editorOl from '!svg-sprite-loader!@/assets/editor/ol.svg';
import editorParagraph from '!svg-sprite-loader!@/assets/editor/paragraph.svg';
import editorQuote from '!svg-sprite-loader!@/assets/editor/quote.svg';
import editorRedo from '!svg-sprite-loader!@/assets/editor/redo.svg';
import editorRemove from '!svg-sprite-loader!@/assets/editor/remove.svg';
import editorStrike from '!svg-sprite-loader!@/assets/editor/strike.svg';
import editorUl from '!svg-sprite-loader!@/assets/editor/ul.svg';
import editorUnderline from '!svg-sprite-loader!@/assets/editor/underline.svg';
import editorUndo from '!svg-sprite-loader!@/assets/editor/undo.svg';
import filter from '!svg-sprite-loader!@/assets/icon-filter.svg';
import home from '!svg-sprite-loader!@/assets/icon-home.svg';
import list from '!svg-sprite-loader!@/assets/icon-list.svg';
import listIn from '!svg-sprite-loader!@/assets/icon-list-in.svg';
import lock from '!svg-sprite-loader!@/assets/icon-lock.svg';
import newWindow from '!svg-sprite-loader!@/assets/icon-new-window.svg';
import pencil from '!svg-sprite-loader!@/assets/icon-pencil.svg';
import plus from '!svg-sprite-loader!@/assets/icon-plus.svg';
import recommendation from '!svg-sprite-loader!@/assets/icon-recommendation.svg';
import reply from '!svg-sprite-loader!@/assets/icon-reply.svg';
import search from '!svg-sprite-loader!@/assets/icon-search.svg';
import sort from '!svg-sprite-loader!@/assets/icon-sort.svg';
import sortAsc from '!svg-sprite-loader!@/assets/icon-sort-asc.svg';
import sortDesc from '!svg-sprite-loader!@/assets/icon-sort-desc.svg';
import time from '!svg-sprite-loader!@/assets/icon-time-black.svg';
import trash from '!svg-sprite-loader!@/assets/icon-trash.svg';
import upload from '!svg-sprite-loader!@/assets/icon-upload.svg';

const ICONS = {
  arrow,
  arrowDouble,
  backArrow,
  check,
  close,
  cross,
  editorBold,
  editorChecklist,
  editorCode,
  editorHr,
  editorImage,
  editorItalic,
  editorLink,
  editorOl,
  editorParagraph,
  editorQuote,
  editorRedo,
  editorRemove,
  editorStrike,
  editorUl,
  editorUnderline,
  editorUndo,
  filter,
  home,
  list,
  listIn,
  lock,
  newWindow,
  pencil,
  plus,
  recommendation,
  reply,
  search,
  sort,
  sortAsc,
  sortDesc,
  time,
  trash,
  upload,
};

function camelCaseToDash(str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

Object.keys(ICONS).forEach((key) => {
  const dashKey = camelCaseToDash(key);
  ICONS[dashKey] = ICONS[key];
});

export default ICONS;
