'use client'

import ComparisonChart from '@/components/comparison/ComparisonChart'
import React, { useState } from 'react'

const Comparison = () => {
    const [project1, setProject1] = useState([]);
    const [project2, setPorject2] = useState([]);

    // Get Projects Data to Select

  return (
    <div>
        <h1>Comparison</h1>
        
        {/* Project 1 */}
        <h3>Select a Project</h3>
        

        {/* Project 2 */}
        <h3>Select a second project to compare</h3>


        {/* Platform */}


        {/* Area Cart or Line Chart to show the comparison */}
        <ComparisonChart project1={project1} project2={project2} />
    </div>
  )
}

export default Comparison