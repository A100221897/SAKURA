const html = document.documentElement

if (localStorage.getItem('theme') === 'dark') {
  html.classList.add('dark')
}

function syncLogos() {
  const dark = html.classList.contains('dark')
  document.querySelectorAll('.logo-light').forEach(el => el.style.display = dark ? 'none' : '')
  document.querySelectorAll('.logo-dark').forEach(el => el.style.display = dark ? '' : 'none')
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  html.classList.toggle('dark')
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
  syncLogos()
})

syncLogos()
