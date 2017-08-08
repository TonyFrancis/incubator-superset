import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "body": {
        "font": "10px sans-serif"
    },
    "axis path": {
        "fill": "none",
        "stroke": "#000",
        "shapeRendering": "crispEdges"
    },
    "axis line": {
        "fill": "none",
        "stroke": "#000",
        "shapeRendering": "crispEdges"
    },
    "bar": {
        "fill": "orange"
    },
    "bar:hover": {
        "fill": "orangered"
    },
    "xaxis path": {
        "display": "none"
    },
    "d3-tip": {
        "lineHeight": 1,
        "fontWeight": "bold",
        "paddingTop": 12,
        "paddingRight": 12,
        "paddingBottom": 12,
        "paddingLeft": 12,
        "background": "rgba(0, 0, 0, 0.8)",
        "color": "#fff",
        "borderRadius": 2
    },
    "d3-tip:after": {
        "boxSizing": "border-box",
        "display": "inline",
        "fontSize": 10,
        "width": "100%",
        "lineHeight": 1,
        "color": "rgba(0, 0, 0, 0.8)",
        "content": "\\25BC",
        "position": "absolute",
        "textAlign": "center"
    },
    "d3-tipn:after": {
        "marginTop": -1,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "top": "100%",
        "left": 0
    }
});