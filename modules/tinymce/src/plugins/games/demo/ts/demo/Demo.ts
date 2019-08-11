declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  theme: 'silver',
  skin_url: '../../../../../js/tinymce/skins/ui/oxide',
  plugins: 'games code',
  toolbar: 'games code',
  content_style: `
  .tinymce-games-ball {
    position: absolute;
    top: 80%;
    left: calc(50% - 0.75rem);
    content: '';
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.75rem;
    background: red;
  `,
  height: 600
});

export {};
