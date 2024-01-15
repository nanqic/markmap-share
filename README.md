[![deploy](https://github.com/nanqic/markmap-loader/actions/workflows/deploy.yml/badge.svg)](https://github.com/nanqic/markmap-loader/actions/workflows/deploy.yml)

# Markmap Share

## 演示站点
https://markmap-loader.pages.dev

## 运行 nodejs >=18
- `npm install`
- `npm start`

## 部署
- `npm run build`

## 快捷键
- `0` or `space`: fit window in center in case you move or zoom it.
- `m`: show all. / hide all except the central one.
- `1`\~`9`: expand to level 1~9.
- `+`: zoom in.
- `-`: zoom out.
- `.`: collapse all to level 1.
- `,`: reset to original tree.
<!-- - `h`: level up.
- `l`: level down.
- `j`: expand step by step.
- `k`: collapse step by step.
- `n`: focus to next sibling.
- `p`: focus to previous sibling.
- `UP`: move mindmap up.
- `DOWN`: move mindmap down.
- `LEFT`: move mindmap left.
- `RIGHT`: move mindmap right.
- `cmd+[`: go backward.
- `cmd+]`: go forward.
- `/`: popup keybindings help model. -->

## caddy配置
``` Caddyfile
box.hdcxb.net {
        encode gzip zstd

        handle_path /@markmap* {
                root * /home/ubuntu/mml
                try_files {path} /
                file_server
        }
}
```
## nginx配置
``` nginx
server {
        listen 8080;

        server_name localhost;
        #root /var/www/html;

        location ^~/@markmap {
                alias /home/ubuntu/markmap-loader/dist;
                try_files $uri $uri/ /@markmap/index.html;
                index index.html;
                location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
                        expires max;
                        log_not_found off;
                }
        }
}
```

## 特别鸣谢
- Oracle cloud 
- Alist org
- cloudflare
- logseq-plugin-mark-map
- blogcdn
- netlify app
- appleboy
- chatgpt
- markmap
- react
- wouter
- tailwindcss
- YOURLS
- @uiw/react-md-editor