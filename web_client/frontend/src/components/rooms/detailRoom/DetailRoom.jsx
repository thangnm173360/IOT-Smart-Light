import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Card, Carousel, Col, notification, Row, Switch } from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { deveiceList, icon } from "database/Deveices/DeveicesConfig";
import "./DetailRoom.css";

import { CgSmartHomeRefrigerator } from "react-icons/cg";
import {
    FaLightbulb,
    FaTemperatureHigh,
    FaTemperatureLow,
} from "react-icons/fa";
import { SiApacheairflow } from "react-icons/si";
import { GiDroplets, GiLightBulb } from "react-icons/gi";
import { FaRegLightbulb } from "react-icons/fa";
import { useEffect } from "react";
import Axios from "axios";
import { Pie, WaterWave } from "ant-design-pro/lib/Charts";
import { light } from "@material-ui/core/styles/createPalette";

const contentStyle = {
    height: "400px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    borderRadius: 15,
    // background: "#364d79",
};
function DetailRoom(props) {
    const roomId = useParams().id;
    const token = localStorage.getItem("token");
    const [lights, setLights] = useState([]);
    const [airCondition, setAirCondition] = useState();
    const [humidity, setHumidity] = useState();
    const [temperature, setTemperature] = useState();

    useEffect(() => {
        Axios.get(`/rooms/${roomId}`, {
            headers: { Authorization: token },
        }).then((res) => {
            let light = [];
            res.data.map((item, index) => {
                if (item.name === "Air Condition") {
                    setAirCondition(item);
                } else {
                    light.push(item);
                }
            });
            console.log("res ", light);
            setLights(light);
        });
    }, []);
    useEffect(() => {
        Axios.get("/api/sensor", { headers: { Authorization: token } }).then(
            (res) => {
                console.log("data ", res.data);
                setHumidity(res.data.humidityAir);
                setTemperature(res.data.temperature);
            }
        );
    }, []);

    const onChange = (id, checked, event) => {
        console.log("checked ", id, checked, event);
        let status = "off";
        if (checked === true) {
            status = "on";
        } else {
            status = "off";
        }

        Axios.patch(
            `/devices/${id}`,
            { status: status },
            { headers: { Authorization: token } }
        )
            .then((res) => {
                console.log("resp ", res.data);
                if (id === airCondition.id) {
                    setAirCondition(res.data);
                } else {
                    let tmp = lights.map((item) => item);
                    let index = findById(id, lights);
                    tmp[index].status = status;
                    console.log("tmp ", tmp);
                    setLights(tmp);
                }

                if (res.data.status === "on") {
                    notification.success({
                        message: "Turn on device successfully!",
                        style: {
                            borderRadius: 15,
                            backgroundColor: "#b7eb8f",
                        },
                        duration: 2,
                    });
                } else {
                    notification.success({
                        message: "Turn off device successfully!",
                        style: {
                            borderRadius: 15,
                            backgroundColor: "#b7eb8f",
                        },
                        duration: 2,
                    });
                }
            })
            .catch((err) => {
                notification.error({
                    message: "server has an error!",
                    style: {
                        borderRadius: 15,
                        backgroundColor: "#fff2f0",
                    },
                    duration: 2,
                });
            });
    };

    const findById = (id, arr) => {
        let index = -1;
        arr.map((item, i) => {
            if (item.id === id) {
                index = i;
            }
        });
        return index;
    };

    return (
        <div className="detail-room">
            <Row>
                <Col span={16}>
                    <Row>
                        <Col span={6}>
                            {airCondition === undefined ? (
                                ""
                            ) : (
                                <Card
                                    hoverable
                                    // cover={<CgSmartHomeRefrigerator size={50} />}
                                    cover={<SiApacheairflow size={50} color="#518e1a" className={airCondition.status === "on"?"icon-air":""} />}
                                >
                                    <Switch
                                        checkedChildren="on"
                                        unCheckedChildren="off"
                                        checked={
                                            airCondition.status === "on"
                                                ? true
                                                : false
                                        }
                                        onChange={(checked, event) =>
                                            onChange(
                                                airCondition.id,
                                                checked,
                                                event
                                            )
                                        }
                                    />
                                    <Meta title={airCondition.name} />
                                </Card>
                            )}
                        </Col>
                        {/* <Col span={6}>
                            <Card
                                hoverable
                                // cover={<FaTemperatureHigh size={50} />}
                                cover={<FaRegLightbulb size={50} />}
                            >
                                <Switch
                                    checkedChildren="on"
                                    unCheckedChildren="off"
                                    defaultChecked
                                />
                                <Meta title="Floor lamp" />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                // cover={<SiApacheairflow size={50} />}
                                cover={<FaLightbulb size={50} />}
                            >
                                <Switch
                                    checkedChildren="on"
                                    unCheckedChildren="off"
                                    defaultChecked
                                />
                                <Meta title="Track light" />
                            </Card>
                        </Col> */}
                        {lights.map((item, index) => {
                            return (
                                <Col span={6} key={index}>
                                    <Card
                                        hoverable
                                        cover={<GiLightBulb size={54} color={
                                            item.status === "on"
                                                ? "#ece707"
                                                : "black"
                                        } />}
                                    >
                                        <Switch
                                            checkedChildren="on"
                                            unCheckedChildren="off"
                                            checked={
                                                item.status === "on"
                                                    ? true
                                                    : false
                                            }
                                            onChange={(checked, event) =>
                                                onChange(
                                                    item.id,
                                                    checked,
                                                    event
                                                )
                                            }
                                        />
                                        <Meta title={item.name} />
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                    {/* temp-3 */}
                    <Row className="temp-3">
                        <Col span={24}>
                            <div className="image-room">
                                <Carousel autoplay>
                                    <div>
                                        <div
                                            className="carousel-1"
                                            style={contentStyle}
                                        ></div>
                                    </div>
                                    <div>
                                        <div
                                            className="carousel-2"
                                            style={contentStyle}
                                        ></div>
                                    </div>
                                    <div>
                                        <div
                                            className="carousel-3"
                                            style={contentStyle}
                                        ></div>
                                    </div>
                                    <div>
                                        <div
                                            className="carousel-4"
                                            style={contentStyle}
                                        ></div>
                                    </div>
                                </Carousel>
                            </div>
                        </Col>
                    </Row>
                </Col>
                {/* col 2 */}
                <Col span={8}>
                    <Row className="detail-2">
                        <Col span={12}>
                            {/* <Card hoverable cover={<GiDroplets size={50} />}>
                                <div style={{ fontSize: 40 }}>20%</div>
                            </Card> */}
                            <div style={{ textAlign: "center" }}>
                                {humidity === undefined ? (
                                    ""
                                ) : (
                                    <WaterWave
                                        height={96}
                                        title="humidity"
                                        percent={humidity}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col span={12} style={{ position: "relative" }}>
                            {/* <Card
                                hoverable
                                // cover={<FaTemperatureLow size={50} />}
                            > */}
                            {/* <div style={{ fontSize: 40 }}>30°C</div> */}

                            {temperature === undefined ? (
                                ""
                            ) : (
                                <Pie
                                    percent={temperature}
                                    subTitle="T°"
                                    // total="28°C"
                                    total={temperature + "°C"}
                                    height={120}
                                    style={{ marginTop: 0 }}
                                />
                            )}
                            {/* </Card> */}
                        </Col>
                    </Row>
                    <Row className="detail-3">
                        <Col span={24}>
                            <Card hoverable cover={<FaLightbulb size={50} />}>
                                <div style={{ fontSize: 30 }}>Detail</div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default DetailRoom;
