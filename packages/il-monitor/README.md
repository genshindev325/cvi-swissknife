### IL Monitor

IL monitor is the Impermanent Loss product's backend service that monitors the IL product wise data and parameters and exposes them to prometheus for Grafana
to alert us of any IL PRODUCT anomalies.

For example, this service might do the following:

- Query the smart contracts every so often to calculate the premium for IL protection. by exposing the values thru prometheus we can monitor and alert on them
  independently.

- Query the smart contracts on the TVP (Total Value Protected), any sudden increase or drop can be monitored.

Service will implement the IL related monitoring in https://docs.google.com/spreadsheets/d/1fq_TXgNKNqFfARNxHFD-kZT3tP1--SGw6mzC4FJEKVk/edit#gid=490050659
