function app(document: Document) {
  const title = document.querySelector('#title')
  if (title) {
    title.innerHTML = "Something else than Gulp"
  }
  const description = document.querySelector('#description')
  if (description) {
    description.innerHTML = "Something else than automate your workflow"
  }
  const bodyTitles = document.querySelectorAll('.sectionTitle')
  if (bodyTitles) {
    bodyTitles[0].innerHTML = "Gulp with sass, typescript and browserSync"
    bodyTitles[1].innerHTML = "See package.json for gulp packages"
  }
}
app(document)