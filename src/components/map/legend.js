import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import * as styles from './map.module.css';

export default function Legend({ mapView }) {

  // Default case: opo-performance map view
  let legendHeader = "OPO Performance Tier";
  let legendItems = OPO_PERFORMANCE_TIER_FILL;

  if (mapView === "congressionalInvestigation") {
    legendHeader = "Under Congressional Investigation"
    legendItems = CONGRESSIONAL_INVESTIGATION_FILL;
  }

  if (mapView === "blackProcurementDisparity") {
    legendHeader = " Procurement Rate (2019)"
    legendItems = BLACK_DONOR_DISPARITY_FILL;
  }
  return (
    <Container className={styles.legend}>
      <Row>
        <h3>{legendHeader} </h3>
      </Row>
      <Row>
        {Object.entries(legendItems)
          .map(([key, val]) => 
            <LegendItem className={styles.legendItem} text={key} background={val.fill} />
          )
        }
      </Row>
    </Container>
  )
}

export function LegendItem({className, background, text}) {
  return (
    <Row className={className}>
      <Col className="flex-grow-0 my-auto">
        <div
          style={{
            background,
            height: `20px`,
            width: `20px`,
            borderRadius: `2rem`,
          }}
        ></div>
      </Col>
      <Col className={`my-auto px-0 ${styles.legendItemText}`}>{text}</Col>
    </Row>
  )
}

export const OPO_PERFORMANCE_TIER_FILL = {
  Passing: { fill: "#C4C4C4" },
  Underperforming:  { fill: "#FFB042" },
  Failing: { fill: "#D43C37" }
} 

export const BLACK_DONOR_DISPARITY_FILL = {
  "N/A": {
    compare: (val) => val === null || val === undefined,
    fill: "#C4C4C4"
  },
  "< 7.5": {
    compare: (val) => val < 7.5,
    fill: "#D43C37"
  },
  "7.5 - 9.4": {
    compare: (val) => val >= 7.5 && val < 9.5,
    fill: "#EA5B3B"
  },
  "9.5 - 11.4": {
    compare: (val) => val >= 9.5 && val < 11.5,
    fill:"#EF924F" 
  },
  "11.5 - 12.9": {
    compare: (val) => val >= 11.5 && val < 13,
    fill: "#F4B55F",
  },
  "13.0 - 15.4": {
    compare: (val) => val >= 13 && val < 15.5,
    fill: "#F9DA84"
  },
  ">= 15.5": {
    compare: (val) => val >= 15.5,
    fill: "#FFFEBB"
  }
}

export const CONGRESSIONAL_INVESTIGATION_FILL = {
  "Yes": { 
    compare: (val) => !!val,
    fill: "#D43C37"
  },
  "No": { 
    compare: (val) => !val,
    fill: "#C4C4C4" 
  }
}