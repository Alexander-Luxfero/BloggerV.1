import Quill from "quill";

const quill = new Quill('#editor', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block'],
      ],
    },
    placeholder: 'Compose an epic...',
    theme: 'snow', // or 'bubble'
  });

  document.addEventListener('DOMContentLoaded', function() {
    const title = document.getElementById('title');
    const text = document.getElementById('main-text');

    title.addEventListener('input', function() {
      this.style.height = 'auto'; // Reset the height to auto to shrink the input
      this.style.height = (this.scrollHeight) + 'px'; // Set the height to the scroll height
    });

    text.addEventListener('input', function() {
      this.style.height = 'auto'; // Reset the height to auto to shrink the input
      this.style.height = (this.scrollHeight) + 'px'; // Set the height to the scroll height
    });
  });