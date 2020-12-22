import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Card, Carousel, Col, Row, Switch } from "antd";
import Meta from "antd/lib/card/Meta";
import React from "react";
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
import { GiDroplets } from "react-icons/gi";
import { useEffect } from "react";
import Axios from "axios";
import { Pie, WaterWave } from "ant-design-pro/lib/Charts";

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

    useEffect(() => {
        Axios.get(`/rooms/${roomId}`, {
            headers: { Authorization: token },
        }).then((res) => {
            console.log("res ", res.data);
        });
    }, []);
    return (
        <div className="detail-room">
            <Row>
                <Col span={16}>
                    <Row>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<CgSmartHomeRefrigerator size={50} />}
                            >
                                <Switch
                                    checkedChildren="on"
                                    unCheckedChildren="off"
                                    checked={false}
                                />
                                <Meta title="Air Condition" />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<FaTemperatureHigh size={50} />}
                            >
                                <Switch
                                    checkedChildren="on"
                                    unCheckedChildren="off"
                                    defaultChecked
                                />
                                <Meta title="Temperature" />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                cover={<SiApacheairflow size={50} />}
                            >
                                <Switch
                                    checkedChildren="on"
                                    unCheckedChildren="off"
                                    defaultChecked
                                />
                                <Meta title="Air conditioner" />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card hoverable cover={<FaLightbulb size={50} />}>
                                <Switch
                                    checkedChildren="on"
                                    unCheckedChildren="off"
                                    defaultChecked
                                />
                                <Meta title="Lights" />
                            </Card>
                        </Col>
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
                                    <WaterWave
                                        height={96}
                                        title="humidity"
                                        percent={30}
                                    />
                                </div>
                        </Col>
                        <Col span={12} style={{position:'relative'}}>
                            {/* <Card
                                hoverable
                                // cover={<FaTemperatureLow size={50} />}
                            > */}
                                {/* <div style={{ fontSize: 40 }}>30°C</div> */}
                                
                                <Pie percent={28} subTitle="T°" total="28°C" height={120} style={{marginTop: 0}} />
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
