it reset --hard
git pull origin HEAD
npm install
pm2 stop scoremanger-react -f
pm2 start scoremanger-react