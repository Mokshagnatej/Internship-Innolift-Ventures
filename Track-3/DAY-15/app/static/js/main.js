document.addEventListener('DOMContentLoaded', () => {
    
    // Staggered Animation for feature groups
    const groups = document.querySelectorAll('.feature-group');
    groups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.15}s`;
    });

    const fillSampleBtn = document.getElementById('fillSampleBtn');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('predictionForm');

    if (form) {
        form.addEventListener('submit', () => {
            submitBtn.classList.add('is-loading');
        });
    }

    if (fillSampleBtn) {
        fillSampleBtn.addEventListener('click', function() {
            // Helper function for random numbers
            const r = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
            
            // Decide if we generate normal data or an anomaly based on the toggle switch
            const toggleElement = document.getElementById('anomalyToggle');
            const isAnomaly = toggleElement ? toggleElement.checked : false; 
            
            let sampleData;
            if (isAnomaly) {
                // Generate anomaly-like values
                const valMin = r(20, 50);
                const valMax = r(98, 100);
                sampleData = {
                    'window_length': 60,
                    'duration_minutes': 60,
                    'sampling_interval_minutes': 1,
                    'value_mean': r(85, 98),
                    'value_std': r(10, 25),
                    'value_min': valMin,
                    'value_max': valMax,
                    'value_median': r(90, 97),
                    'value_q25': r(80, 90),
                    'value_q75': r(96, 99),
                    'value_range': (valMax - valMin).toFixed(2),
                    'value_iqr': r(5, 15),
                    'value_first': r(40, 80),
                    'value_last': r(95, 100),
                    'value_trend': r(0.5, 1.5),
                    'value_abs_diff_mean': r(5, 15),
                    'value_abs_diff_std': r(2, 8),
                    'value_max_jump': r(20, 50),
                    'value_energy': r(8000, 9500),
                    'peak_to_mean_ratio': r(1.05, 1.3)
                };
            } else {
                // Generate strict normal-like values that model expects
                const valMin = r(30, 45);
                const valMax = r(55, 70);
                sampleData = {
                    'window_length': 60,
                    'duration_minutes': 60,
                    'sampling_interval_minutes': 1,
                    'value_mean': r(40, 60),
                    'value_std': r(1, 5),
                    'value_min': valMin,
                    'value_max': valMax,
                    'value_median': r(45, 55),
                    'value_q25': r(42, 48),
                    'value_q75': r(52, 58),
                    'value_range': (valMax - valMin).toFixed(2),
                    'value_iqr': r(2, 6),
                    'value_first': r(45, 55),
                    'value_last': r(45, 55),
                    'value_trend': r(-0.1, 0.1),
                    'value_abs_diff_mean': 0.0,
                    'value_abs_diff_std': r(0.1, 1.0),
                    'value_max_jump': r(1, 5),
                    'value_energy': r(3000, 5000),
                    'peak_to_mean_ratio': 1.0
                };
            }
            
            // Apply the values with a subtle flash effect
            for (const [key, value] of Object.entries(sampleData)) {
                const input = document.getElementById(key);
                if (input) {
                    input.value = value;
                    input.style.transition = 'background-color 0.4s ease, box-shadow 0.4s ease';
                    
                    // Highlight based on type of data generated
                    if (isAnomaly) {
                        input.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; 
                        input.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.3)';
                    } else {
                        input.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'; 
                        input.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.3)';
                    }
                    
                    // Reset to normal styles
                    setTimeout(() => {
                        input.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
                        input.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
                    }, 500);
                }
            }
        });
    }
});
