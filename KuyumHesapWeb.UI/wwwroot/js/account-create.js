document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => {
                content.classList.toggle(
                    'active',
                    content.id === `tab-${tab.dataset.tab}`
                );
            });
        });
    });

});