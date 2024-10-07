# PeerTube plugin VAST ads

## Build plugin source
```npm run build```

## Connect to a Peertube instance
```peertube-cli auth add -u 'PEERTUBE_URL' -U 'PEERTUBE_USER' --password 'PEERTUBE_PASSWORD'```

Local example:

```peertube-cli auth add -u 'http://localhost:3000/' -U 'root' --password 'test'```

## Install the plugin in the Peertube instance (should be done only once)
```peertube-cli plugins install --path /absolute/path/to/peertube-plugin-vast-ads```


## Update Plugin en Peertube after each new build
```peertube-cli plugins update --path /absolute/path/to/peertube-plugin-vast-ads```
