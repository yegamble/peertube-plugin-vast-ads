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

## Cool off period between ads

From version next, the plugin keeps track of the last time an ad was displayed in the browser. You can configure the delay between ads with the **Ads cool off time (minutes)** setting (default is 5 minutes). When the user opens a new video before this delay has expired, no preroll, midroll or postroll ads will be shown.
