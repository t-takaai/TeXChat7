<messages>
  <ul>
    <li each={ items }>{ name } : { message }</li>
  </ul>

  this.items = opts.items;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"messages"]);                  // MathJaxをかける
</messages>
