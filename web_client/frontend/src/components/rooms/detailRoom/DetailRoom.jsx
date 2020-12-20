import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Card, Col, Row, Switch } from "antd";
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

function DetailRoom(props) {
  const roomId = useParams().id;
  console.log("test", roomId);
  return (
    <div className="detail-room">
      <Row>
        <Col span={16}>
          <Row>
            <Col span={6}>
              <Card hoverable cover={<CgSmartHomeRefrigerator size={50} />}>
                <Switch
                  checkedChildren="on"
                  unCheckedChildren="off"
                  defaultChecked
                />
                <Meta title="Refridgerator" />
              </Card>
            </Col>
            <Col span={6}>
              <Card hoverable cover={<FaTemperatureHigh size={50} />}>
                <Switch
                  checkedChildren="on"
                  unCheckedChildren="off"
                  defaultChecked
                />
                <Meta title="Temperature" />
              </Card>
            </Col>
            <Col span={6}>
              <Card hoverable cover={<SiApacheairflow size={50} />}>
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
              <Card hoverable cover={<FaLightbulb size={50} />}>
                
                <div style={{ fontSize: 30 }}>Detail</div>
              </Card>
              </Col>
          </Row>
        </Col>
        {/* col 2 */}
        <Col span={8} >
          <Row className="detail-2">
            <Col span={12}>
              <Card hoverable cover={<GiDroplets size={50} />}>
                <div style={{ fontSize: 40 }}>20%</div>
              </Card>
            </Col>
            <Col span={12}>
              <Card hoverable cover={<FaTemperatureLow size={50} />}>
                <div style={{ fontSize: 40 }}>30°C</div>
              </Card>
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
