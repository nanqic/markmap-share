[![deploy](https://github.com/nanqic/markmap-loader/actions/workflows/deploy.yml/badge.svg)](https://github.com/nanqic/markmap-loader/actions/workflows/deploy.yml)

# Markmap Loader

## 运行 nodejs >=18
- `npm install`
- `npm start`

## 部署
- `npm run build`

## caddy配置
``` Caddyfile
box.hdcxb.net {
        encode gzip zstd

        handle_path /@markmap* {
                root * /home/ubuntu/markmap-loader/dist
                file_server
        }
        handle_path /* {
                reverse_proxy 127.0.0.1:5244 {
                        header_up Host {http.reverse_proxy.upstream.hostport}
                        header_down Access-Control-Allow-Headers *
                        header_down Access-Control-Allow-Origin *
                }
        }
}
```
