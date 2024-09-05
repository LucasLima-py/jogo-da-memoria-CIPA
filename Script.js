const imagens = [
    "https://www.dystray.com.br/imagens/informacoes/capacete-seguranca-epi-01.jpg", // Capacete Jugular
    "https://www.higiclear.com/wp-content/uploads/2019/02/LUVA-NITRILICA-VERDE.jpg", // Luva Nitrilica
    "https://www.novaepi.com.br/wp-content/uploads/2022/09/15140129051_tatil-black-smart.jpg", // Luva Tátil Hi-Tex
    "https://img.lojadomecanico.com.br/IMAGENS/36/709/117983/1697223346952.JPG?ims=100x100/filters:quality(50)", // Cinto talabarte
    "https://images.tcdn.com.br/img/img_prod/503224/oculos_de_seguranca_linha_medica_7483301_1_20200506152553.jpg", // Óculos de Proteção
    "https://www.protefix.com.br/home/images_clientes/050/produtos/extintor-de-incendio-22249-146_22249.png", // Extintor de Incêndio
    "https://div6kz4xdf2fj.cloudfront.net/Custom/Content/Products/24/69/2469092_botina-de-seguranaa-sul-com-elastico-e-bico-pvc-idintegracao-1146-sku-12179_m6_638285736809892099.jpg", // Bota de segurança
    "https://st2.depositphotos.com/2143989/7649/v/380/depositphotos_76493763-stock-illustration-yellow-awareness-ribbon-on-white.jpg" //Laço Amarelo
];

let cartasViradas = 0;
let primeiraCarta = null;
let segundaCarta = null;
let jogoEmPausa = false;
let pontos = 0;

let intervalo;
let [segundos, minutos, horas] = [0, 0, 0];
let timerComeçou = false;

function começarTimer() {
    if (!timerComeçou) {
        clearInterval(intervalo);
        intervalo = setInterval(updateTimer, 1000);
        timerComeçou = true;
    }
}

function updateTimer() {
    segundos++;
    if (segundos === 60) {
        segundos = 0;
        minutos++;
        if (minutos === 60) {
            minutos = 0;
            horas++;
        }
    }
    document.getElementById('timer').innerText = formatTime(horas) + ':' + formatTime(minutos) + ':' + formatTime(segundos);
}

function formatTime(time) {
    return (time < 10 ? '0' : '') + time;
}

function displayInfo(NumCarta) {
    const containerDireitaEmbaixo = document.querySelector('.container.direita-baixo');
    containerDireitaEmbaixo.innerHTML = "";

    fetch('infos.json')
        .then(response => response.json())
        .then(data => {
            const infoObj = data.find(obj => obj[NumCarta]);
            if (infoObj) {
                const cartaInfo = document.createElement('div');
                cartaInfo.classList.add('carta-info');

                const cartaConteudo = document.createElement('div');
                cartaConteudo.classList.add('carta-conteudo');

                const cartaImagem = document.createElement('img');
                cartaImagem.src = `${NumCarta}`;
                cartaImagem.style.opacity = '0';
                cartaConteudo.appendChild(cartaImagem);

                const cartaTexto = document.createElement('div');
                cartaTexto.classList.add('carta-text');
                cartaTexto.style.opacity = '0';
                cartaTexto.textContent = infoObj[NumCarta];
                cartaConteudo.appendChild(cartaTexto);

                cartaInfo.appendChild(cartaConteudo);

                const cartaInfoDetalhes = document.createElement('div');
                cartaInfoDetalhes.classList.add('carta-info-detalhes');

                const objetivoContainer = document.createElement('div');
                objetivoContainer.innerHTML = '<br><b>Objetivo:</b> ' + infoObj['Objetivo'];
                cartaInfoDetalhes.appendChild(objetivoContainer);

                const contribuirContainer = document.createElement('div');
                contribuirContainer.innerHTML = '<br><b>Como contribuir:</b> ' + infoObj['Acoes'].replace(/\n/g, '<br>');
                cartaInfoDetalhes.appendChild(contribuirContainer);

                cartaInfoDetalhes.style.opacity = '0';
                setTimeout(() => {
                    cartaImagem.style.transition = 'opacity 0.5s ease-in-out';
                    cartaImagem.style.opacity = '1';
                    cartaTexto.style.transition = 'opacity 0.5s ease-in-out';
                    cartaTexto.style.opacity = '1';
                    cartaInfoDetalhes.style.transition = 'opacity 0.5s ease-in-out';
                    cartaInfoDetalhes.style.opacity = '1';
                }, 100);

                cartaInfo.appendChild(cartaInfoDetalhes);

                containerDireitaEmbaixo.appendChild(cartaInfo);
            }
        })
        .catch(error => console.error('Erro:', error));
}

function iniciarJogo() {
    imagens.sort(() => Math.random() - 0.5);

    const imagensDuplicadas = imagens.concat(imagens.slice());

    const grade = document.querySelector(".grade");
    grade.innerHTML = "";

    setGridSize();

    for (let i = 0; i < imagensDuplicadas.length; i++) {
        const carta = document.createElement("div");
        carta.classList.add("carta");

        const frente = document.createElement("div");
        frente.classList.add("frente");
        frente.style.backgroundImage = `url('${imagensDuplicadas[i]}')`;
        carta.appendChild(frente);

        const verso = document.createElement("div");
        verso.classList.add("verso");
        carta.appendChild(verso);

        carta.addEventListener("click", () => {
            começarTimer();
            if (jogoEmPausa || carta.classList.contains("virada") || carta === document.querySelector(".carta-central")) return;

            carta.classList.add("virada");
            cartasViradas++;

            if (cartasViradas === 1) {
                primeiraCarta = carta;
            } else if (cartasViradas === 2) {
                segundaCarta = carta;

                if (primeiraCarta.querySelector(".frente").style.backgroundImage === segundaCarta.querySelector(".frente").style.backgroundImage) {
                    const NumCarta = segundaCarta.querySelector(".frente").style.backgroundImage.split('url("').pop().split('")')[0];

                    displayInfo(NumCarta);

                    pontos++;
                    document.querySelector(".pontos").textContent = `Pontos: ${pontos}`;
                    primeiraCarta = null;
                    segundaCarta = null;
                    cartasViradas = 0;

                    if (pontos === 8) {
                        clearInterval(intervalo);
                        Swal.fire({
                            icon: "success",
                            title: "Parabéns!!",
                            text: "Você completou o jogo com " + pontos + " pontos",
                        });
                        pontos = 0;
                    }
                } else {
                    jogoEmPausa = true;
                    setTimeout(() => {
                        primeiraCarta.classList.remove("virada");
                        segundaCarta.classList.remove("virada");
                        primeiraCarta = null;
                        segundaCarta = null;
                        cartasViradas = 0;
                        jogoEmPausa = false;
                    }, 1000);
                }
            }
        });

        grade.appendChild(carta);
    }

    const cartaCentral = document.createElement("div");
    cartaCentral.classList.add("carta-central");
    const imgCentral = document.createElement("img");
    imgCentral.src = "https://www.tekbond.com.br/sites/tekbond.com.br/files/2021-08/logo-tekbond-saint-gobain-tradicional.jpg";
    imgCentral.alt = "Tekbond Logo";
    cartaCentral.appendChild(imgCentral);
    grade.appendChild(cartaCentral);
}

function setGridSize() {
    const grade = document.querySelector(".grade");
    grade.style.gridTemplateColumns = `repeat(4, 1fr)`;
}

window.addEventListener("resize", setGridSize);

document.querySelector(".botao-reiniciar").addEventListener("click", function reiniciar() {
    pontos = 0;
    clearInterval(intervalo);
    [segundos, minutos, horas] = [0, 0, 0];
    timerComeçou = false;
    document.getElementById('timer').innerText = '00:00:00';
    document.querySelector(".pontos").textContent = `Pontos: ${pontos}`;
    const containerDireitaEmbaixo = document.querySelector('.container.direita-baixo');
    containerDireitaEmbaixo.innerHTML = "";

    iniciarJogo();
});

iniciarJogo();
