function generarExportarProductosHTML(productos_por_venta) {
  let date_ob = new Date();
  let date = ('0' + date_ob.getDate()).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  var html =
    `
    <style>


body {
    margin: 0
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
menu,
nav,
section,
summary {
    display: block
}

audio,
canvas,
progress,
video {
    display: inline-block;
    vertical-align: baseline
}

audio:not([controls]) {
    display: none;
    height: 0
}

[hidden],
template {
    display: none
}

a {
    background-color: transparent
}

a:active,
a:hover {
    outline: 0
}

abbr[title] {
    border-bottom: 1px dotted
}

b,
strong {
    font-weight: bold
}

dfn {
    font-style: italic
}

h1 {
    font-size: 2em;
    margin: 0.67em 0
}

mark {
    background: #ff0;
    color: #000
}

small {
    font-size: 80%
}

sub,
sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline
}

sup {
    top: -0.5em
}

sub {
    bottom: -0.25em
}

img {
    border: 0
}

svg:not(:root) {
    overflow: hidden
}

figure {
    margin: 1em 40px
}

hr {
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    height: 0
}

pre {
    overflow: auto
}

code,
kbd,
pre,
samp {
    font-family: monospace, monospace;
    font-size: 1em
}

button,
input,
optgroup,
select,
textarea {
    color: inherit;
    font: inherit;
    margin: 0
}

button {
    overflow: visible
}

button,
select {
    text-transform: none
}

button,
html input[type="button"],
input[type="reset"],
input[type="submit"] {
    -webkit-appearance: button;
    cursor: pointer
}

button[disabled],
html input[disabled] {
    cursor: default
}

button::-moz-focus-inner,
input::-moz-focus-inner {
    border: 0;
    padding: 0
}

input {
    line-height: normal
}

input[type="checkbox"],
input[type="radio"] {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    height: auto
}

input[type="search"] {
    -webkit-appearance: textfield;
    -moz-box-sizing: content-box;
    box-sizing: content-box
}

input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none
}

fieldset {
    border: 1px solid #c0c0c0;
    margin: 0 2px;
    padding: 0.35em 0.625em 0.75em
}

legend {
    border: 0;
    padding: 0
}

textarea {
    overflow: auto
}

optgroup {
    font-weight: bold
}

table {
    border-collapse: collapse;
    border-spacing: 0
}

td,
th {
    padding: 0
}

html {
    font-size: 12px;
    line-height: 0rem;
    color: #000;
    -moz-box-sizing: border-box;
    box-sizing: border-box
}

body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: 2rem auto 0;
    max-width: 800px;
    background: white;
    padding: 2rem
}

.container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem
}

*,
*:before,
*:after {
    -moz-box-sizing: inherit;
    box-sizing: inherit
}

[contenteditable]:hover,
[contenteditable]:focus,
input:hover,
input:focus {
    background: rgba(241, 76, 76, 0.1);
    outline: 1px solid #009688
}

.group:after,
.row:after,
.invoicelist-footer:after {
    content: "";
    display: table;
    clear: both
}

a {
    color: #009688;
    text-decoration: none
}

p {
    margin: 0
}

.row {
    position: relative;
    display: block;
    width: 100%;
    font-size: 0
}

.col,
.logoholder,
.me,
.info,
.bank,
[class*="col-"] {
    vertical-align: top;
    display: inline-block;
    font-size: 1rem;
    padding: 0 1rem;
    min-height: 1px
}

.col-4 {
    width: 25%
}

.col-3 {
    width: 33.33%
}

.col-2 {
    width: 50%
}

.col-2-4 {
    width: 75%
}

.col-1 {
    width: 100%
}

.text-center {
    text-align: center
}

.text-right {
    text-align: right
}

.control-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #009688;
    color: white;
    line-height: 4rem;
    height: 4rem
}

.control-bar .slogan {
    font-weight: bold;
    font-size: 1.2rem;
    display: inline-block;
    margin-right: 2rem
}

.control-bar label {
    margin-right: 1rem
}

.control-bar a {
    margin: 0;
    padding: .5em 1em;
    background: rgba(255, 255, 255, 0.8)
}

.control-bar a:hover {
    background: #fff
}

.control-bar input {
    border: none;
    background: rgba(255, 255, 255, 0.2);
    padding: .5rem 0;
    max-width: 30px;
    text-align: center
}

.control-bar input:hover {
    background: rgba(255, 255, 255, 0.3)
}

.hidetax .taxrelated {
    display: none
}

.showtax .notaxrelated {
    display: none
}

.hidedate .daterelated {
    display: none
}

.showdate .notdaterelated {
    display: none
}

header {
    margin: 0.5rem 0 0;
    padding: 0 0 1rem 0;
    border-bottom: 3pt solid #009688
}

header p {
    font-size: .9rem
}

header a {
    color: #000
}

.logo {
    margin: 0 auto;
    width: auto;
    height: auto;
    border: none;
    fill: #009688
}

.logoholder {
    width: 14%
}

.me {
    width: 30%
}

.info {
    width: 30%
}

.bank {
    width: 26%
}

.section {
    margin: 2rem 0 0
}

.smallme {
    display: inline-block;
    text-transform: uppercase;
    margin: 0 0 2rem 0;
    font-size: .9rem
}

.client {
    margin: 0 0 3rem 0
}

h1 {
    margin: 0;
    padding: 0;
    font-size: 2rem;
    color: #009688
}

.details input {
    display: inline;
    margin: 0 0 0 .5rem;
    border: none;
    width: 50px;
    min-width: 0;
    background: transparent;
    text-align: left
}


.invoice_detail{
	border: solid 1px #009688;
	padding:10px;
	height:2px;
	text-align:center
}

.rate:before,
.price:before,
.sum:before,
.tax:before,
#total_price:before,
#total_tax:before {
    content: '$'
}

.invoicelist-body {
    margin: 1rem
}

.invoicelist-body table {
    width: 100%
}

.invoicelist-body thead {
    text-align: left;
    border-bottom: 1pt solid #666
}

.invoicelist-body td,
.invoicelist-body th {
    position: relative;
    padding: 0rem;
    border-bottom: 1px solid #A1A1A1;
}

.invoicelist-body tr:nth-child(even) {
    background: #ccc
}

.invoicelist-body tr:hover .removeRow {
    display: block
}

.invoicelist-body input {
    display: inline;
    margin: 0;
    border: none;
    width: 80%;
    min-width: 0;
    background: transparent;
    text-align: left
}

.invoicelist-body .control {
    display: inline-block;
    color: white;
    background: #009688;
    padding: 3px 7px;
    font-size: .9rem;
    text-transform: uppercase;
    cursor: pointer
}

.invoicelist-body .control:hover {
    background: #f36464
}

.invoicelist-body .newRow {
    margin: .5rem 0;
    float: left
}

.invoicelist-body .removeRow {
    display: none;
    position: absolute;
    top: .1rem;
    bottom: .1rem;
    left: -1.3rem;
    font-size: .7rem;
    border-radius: 3px 0 0 3px;
    padding: .5rem
}

.invoicelist-footer {
    margin: 1rem
}

.invoicelist-footer table {
    float: right;
    width: 25%
}

.invoicelist-footer table td {
    padding: 1rem 2rem 0 1rem;
    text-align: right
}

.invoicelist-footer table tr:nth-child(2) td {
    padding-top: 0
}

.invoicelist-footer table #total_price {
    font-size: 2rem;
    color: #009688
}

.note {
    margin: 1rem
}

.hidenote .note {
    display: none
}

.note h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold
}

footer {
    display: block;
    margin: 1rem 0 1rem 0;
    padding: 1rem 0 0
}

footer p {
    font-size: .8rem
}



/*# sourceMappingURL=main.css.map */

</style>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>

<header class="row">
  <div class="logoholder text-center" >
  <img src="https://dyg-frontend.herokuapp.com/assets/images/logo-dygcombos.png" style="max-width: 70px; height: 70px; margin-right:30px;">
  </div><!--.logoholder-->

  <div class="me">
    <p >
      <strong>Fecha: ` +
    date +
    '-' +
    month +
    '-' +
    year +
    `</strong><br>
      dygcombos.com.ar<br>
      
    </p>
  </div><!--.me-->

</header>
<div class="invoicelist-body">
  <table>
    <thead >
      <th width="80%" style="text-align:left;font-size:10px;">Descripción</th>
      <th width="20%" style="text-align:center;font-size:10px;">Cantidad</th>
    </thead>
    </table>
</div>
`;
  productos_por_venta.forEach(producto => {
    html =
      html +
      `<div class="invoicelist-body">
      <table>
        <tbody>
          <tr>
            <td width='80%' style="text-align:left;font-size:4px;"> <span >` +
      producto[0] +
      `</span></td>
            <td width='20%' style="text-align:center;font-size:4px;"><span >` +
      producto[1] +
      `</span></td>
          </tr> 
        </tbody>
      </table>
      </div><!--.invoice-body-->`;
  });

  html += `<footer class="row">
<div class="col-1 text-center">

</div>
</footer>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="assets/bower_components/jquery/dist/jquery.min.js"><\/script></script>
<script src="assets/js/main.js"></script>
</body>
</html>`;

  return html;
}

module.exports = generarExportarProductosHTML;
