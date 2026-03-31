document.addEventListener('DOMContentLoaded', function() {
    const entries = document.querySelectorAll('.entry.collapsible');
    
    entries.forEach(entry => {
        const header = entry.querySelector('.entry-header');
        header.addEventListener('click', function() {
            entry.classList.toggle('collapsed');
        });
    });
});
