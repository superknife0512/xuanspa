import $ from 'jquery';

const showDOM = document.querySelector('.client-service__show');

if(showDOM){
    function displayService(tag){
        const allShows = document.querySelectorAll('.client-service__show');
        allShows.forEach(show=>{
            show.classList.remove('activeService');
        })
        $(`[data-tag=${tag}]`).addClass('activeService');
    }

    function activeTab(tab){
        const allTabs = document.querySelectorAll('.client-service__tab');
        allTabs.forEach(tab=>{
            tab.classList.remove('tab-active');
        })
        $(`[data-tab=${tab}]`).addClass('tab-active');
    }

    displayService('face');
    activeTab('face')

    $('[data-tab=face').click(function(){
        activeTab('face');
        displayService('face')
    })
    $('[data-tab=massage').click(function(){
        activeTab('massage');
        displayService('massage')
    })

    $('[data-tab=body').click(function(){
        activeTab('body');
        displayService('body')
    })

    $('[data-tab=package').click(function(){
        activeTab('package');
        displayService('package')
    })

    $('[data-tab=all').click(function(){
        activeTab('all');
        displayService('all')
    })
}