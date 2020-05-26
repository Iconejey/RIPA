# RIPA

## Un projet de robotique.

RIPA est un projet de robotique initialement né dans un lycée en Mars 2018 puis officialisé à l'Université des Antilles par l'association [Wi-Bash](http://wi-bash.fr/) en début d'année scolaire 2019-2020 et financé par la FSDIE.

RIPA est un drone terrestre quadrupède inspiré de [Spot Mini](https://www.youtube.com/watch?v=wlkCQXHEgjA) de Boston Dynamics.

## Contrôle du drone.
RIPA peut être contrôlé via une page web mobile communicant avec son programme via un serveur node.js embarqué dans le drone. L'app web permet également de visualiser la position du drone et son environnement grâce à des potentiomètres, un IMU, un GPS et une caméra 3D.

Lors du démarage de RIPA, le serveur node.js se lance sur le réseau local. Pour contrôler RIPA il suffit d'entrer l'addresse du serveur (exemple: `http://192.168.1.16:5500/`) dans un navigateur ou de scanner le QR code généré par un script python. Pour reprendre l'exemple précédent:

    http://192.168.1.16:5500/
    █▀▀▀▀▀▀▀█▀████▀▀▀▀█▀▀▀▀▀▀▀█
    █ █▀▀▀█ █ ▀█▄ ██ ▀█ █▀▀▀█ █
    █ █   █ █▄  █ ▀▀▄▀█ █   █ █
    █ ▀▀▀▀▀ █ ▄ █▀▄ ▄ █ ▀▀▀▀▀ █
    █▀▀██▀▀▀███ ▄▀▀▀ ▄██▀█▀▀▀▀█
    █▄ ▄▀▀█▀▄▄▀▀██▄▄█ ▄ █  ▀▄██
    █▀▄▄█▄▄▀▀▀▄█▀▄▀▀  █▄ ▀▀  ▀█
    █▄█    ▀█ █▄▀ ▀ █▄ █▄ ▀▀▄██
    █▀▀█ █ ▀ ▀▄▀▄▀ ██▀▀▀▀▀▄ ▄██
    █▀▀▀▀▀▀▀█▄▀███▄▄▀ █▀█ ▀▀███
    █ █▀▀▀█ █ █ ▀▄▀ ▀ ▀▀▀ ▄▀ ▀█
    █ █   █ ███▀▀ ▀▀█▄██▀▀▄█▀▄█
    █ ▀▀▀▀▀ █ █▄▄▀ █ █ ▀▄ █▀ ▀█
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
 
 Le serveur vous redirigera alors vers la page `http://.../controler/.` Vous pourrez alors voir une représentation 3D schématique de RIPA et de ce qu'il voit ainsi que deux joysticks pour le déplacer.