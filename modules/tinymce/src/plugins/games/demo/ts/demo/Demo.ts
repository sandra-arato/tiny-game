declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  theme: 'silver',
  skin_url: '../../../../../js/tinymce/skins/ui/oxide',
  plugins: 'games code wordcount',
  toolbar: 'games code',
  content_style: `
  .tinymce-games-ball {
    position: absolute;
    top: 80vh;
    left: calc(50% - 0.75rem);
    transform: translate(0, 0);
    content: '';
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.75rem;
    background-image: url('data:image/png;base64,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');
    background-size: auto 90%;
    background-repeat: no-repeat;
    background-position: 0 3px;
  }
  .tinymce-games-paddle {
    position: absolute;
    top: calc(80% + 1.75rem);
    left: calc(50% - 4rem);
    content: '';
    display: block;
    width: 8rem;
    height: 1rem;
    background: #1976d2;
    transform: translateX(0);
    transition: transform 120ms linear;
  }
  `,
  height: 600
});

export {};
