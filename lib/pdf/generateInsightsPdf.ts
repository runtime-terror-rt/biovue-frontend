export interface GenerateInsightsPdfParams {
  reportTitle: string;
  isFiveYear: boolean;
  insightsToReport: any[];
  userName?: string;
}

export const generateInsightsPdf = async ({
  reportTitle,
  isFiveYear,
  insightsToReport,
  userName = "Valued Member",
}: GenerateInsightsPdfParams): Promise<void> => {
  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule.default;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  const maxY = pageHeight - 16; // 281mm max content bottom

  let currentY = margin;

  // Helper function to draw Main Header (Page 1)
  const drawMainHeader = () => {
    // Teal Header Banner
    doc.setFillColor(15, 164, 169); // #0FA4A9
    doc.roundedRect(margin, 12, contentWidth, 32, 4, 4, "F");

    // Subtitle badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(189, 232, 232); // #BDE8E8
    doc.text("BIOVUE DIGITAL WELLNESS  |  HEALTH INTELLIGENCE", margin + 10, 20);

    // Document Title
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(reportTitle.toUpperCase(), margin + 10, 27);

    // Member Info Badge Right
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - margin - 54, 16, 46, 12, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(15, 164, 169);
    doc.text("PREMIUM MEMBER", pageWidth - margin - 31, 20.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(31, 45, 46);
    const truncatedName = userName.length > 20 ? userName.slice(0, 18) + "..." : userName;
    doc.text(truncatedName, pageWidth - margin - 31, 25, { align: "center" });

    // Meta Line inside banner
    doc.setFontSize(7.5);
    doc.setTextColor(230, 246, 246);
    const dateStr = `Date: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
    const typeStr = `Type: ${isFiveYear ? "5-Year Projection" : "Current Analysis"}`;
    const countStr = `Total Items: ${insightsToReport.length}`;
    doc.text(`${dateStr}   •   ${typeStr}   •   ${countStr}`, margin + 10, 37);

    currentY = 48;
  };

  // Helper function to draw Running Header (Pages 2+)
  const drawRunningHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 164, 169);
    doc.text("BIOVUE HEALTH REPORT", margin, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(reportTitle, pageWidth / 2, 14, { align: "center" });

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    doc.text(dateStr, pageWidth - margin, 14, { align: "right" });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, 17, pageWidth - margin, 17);

    currentY = 23;
  };

  // Helper function to draw Footer on all pages
  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("BioVue Digital Wellness • Confidential Health Document", margin, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 7, {
      align: "right",
    });
  };

  // Helper for page break check
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > maxY) {
      doc.addPage();
      drawRunningHeader();
    }
  };

  // Draw Main Header on Page 1
  drawMainHeader();

  // Summary Bar (Page 1)
  ensureSpace(20);
  doc.setFillColor(240, 249, 250); // #F0F9FA
  doc.setDrawColor(189, 232, 232); // #BDE8E8
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "FD");

  const highPriorityCount = insightsToReport.filter(
    (i: any) => String(i.priority || "").toUpperCase() === "HIGH"
  ).length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  // Col 1: Total Insights
  doc.setTextColor(15, 164, 169);
  doc.text("TOTAL INSIGHTS", margin + 12, currentY + 6);
  doc.setFontSize(10);
  doc.setTextColor(31, 45, 46);
  doc.text(`${insightsToReport.length} Insights Analyzed`, margin + 12, currentY + 11.5);

  // Col 2: Priority breakdown
  doc.setFontSize(8);
  doc.setTextColor(15, 164, 169);
  doc.text("HIGH IMPACT ITEMS", margin + 70, currentY + 6);
  doc.setFontSize(10);
  doc.setTextColor(
    highPriorityCount > 0 ? 220 : 31,
    highPriorityCount > 0 ? 38 : 45,
    highPriorityCount > 0 ? 38 : 46
  );
  doc.text(`${highPriorityCount} Key Priority Action(s)`, margin + 70, currentY + 11.5);

  // Col 3: Report Mode
  doc.setFontSize(8);
  doc.setTextColor(15, 164, 169);
  doc.text("STATUS", margin + 135, currentY + 6);
  doc.setFontSize(10);
  doc.setTextColor(31, 45, 46);
  doc.text(
    isFiveYear ? "5-Year Outlook Active" : "Current Baseline Active",
    margin + 135,
    currentY + 11.5
  );

  currentY += 22;

  // Section Header Title
  ensureSpace(10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 164, 169);
  doc.text("DETAILED INSIGHTS & RECOMMENDATIONS", margin, currentY);
  doc.setDrawColor(15, 164, 169);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 2, margin + 85, currentY + 2);
  currentY += 8;

  // Render Each Insight Card
  insightsToReport.forEach((item: any) => {
    const priorityText = `${(item.priority || "MEDIUM").toUpperCase()} IMPACT`;
    const categoryText = (item.category || "GENERAL").toUpperCase();
    const insightTitle = item.insight || "";

    const titleLines = doc.splitTextToSize(insightTitle, contentWidth - 20);

    let whyMattersLines: string[] = [];
    if (item.why_this_matters) {
      whyMattersLines = doc.splitTextToSize(`"${item.why_this_matters}"`, contentWidth - 28);
    }

    let impactLines: string[] = [];
    if (item.expected_impact) {
      impactLines = doc.splitTextToSize(item.expected_impact, contentWidth - 24);
    }

    let actionStepLines: string[][] = [];
    if (item.action_steps && item.action_steps.length > 0) {
      item.action_steps.forEach((step: string) => {
        actionStepLines.push(doc.splitTextToSize(step, contentWidth - 28));
      });
    }

    let expectedChangeLines: string[][] = [];
    if (item.expected_changes && item.expected_changes.length > 0) {
      item.expected_changes.forEach((change: string) => {
        expectedChangeLines.push(doc.splitTextToSize(change, contentWidth - 28));
      });
    }

    // Calculate card height
    let cardH = 18 + titleLines.length * 5;
    if (whyMattersLines.length > 0) cardH += 10 + whyMattersLines.length * 4.2;
    if (impactLines.length > 0) cardH += 10 + impactLines.length * 4.2;
    if (actionStepLines.length > 0) {
      cardH += 7;
      actionStepLines.forEach((l) => (cardH += l.length * 4.2 + 2));
    }
    if (expectedChangeLines.length > 0) {
      cardH += 7;
      expectedChangeLines.forEach((l) => (cardH += l.length * 4.2 + 2));
    }

    // Check if card fits on current page
    if (currentY + cardH > maxY && cardH < maxY - 25) {
      doc.addPage();
      drawRunningHeader();
    }

    const cardStartY = currentY;

    // Draw Card Container
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, cardStartY, contentWidth, cardH, 3, 3, "FD");

    let innerY = cardStartY + 8;

    // Priority Badge
    const isHigh = String(item.priority || "").toUpperCase() === "HIGH";
    if (isHigh) {
      doc.setFillColor(254, 226, 226);
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setFillColor(219, 234, 254);
      doc.setTextColor(37, 99, 235);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    const pWidth = doc.getTextWidth(priorityText) + 8;
    doc.roundedRect(margin + 8, innerY - 4, pWidth, 5.5, 1.5, 1.5, "F");
    doc.text(priorityText, margin + 8 + pWidth / 2, innerY - 0.2, { align: "center" });

    // Category Badge
    doc.setFillColor(230, 246, 246);
    doc.setTextColor(15, 164, 169);
    const cWidth = doc.getTextWidth(categoryText) + 8;
    doc.roundedRect(margin + 12 + pWidth, innerY - 4, cWidth, 5.5, 1.5, 1.5, "F");
    doc.text(categoryText, margin + 12 + pWidth + cWidth / 2, innerY - 0.2, { align: "center" });

    innerY += 8;

    // Insight Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(31, 45, 46);
    titleLines.forEach((line: string) => {
      doc.text(line, margin + 8, innerY);
      innerY += 4.8;
    });

    innerY += 2;

    // Why This Matters Box
    if (whyMattersLines.length > 0) {
      const boxH = 7 + whyMattersLines.length * 4.2;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin + 8, innerY, contentWidth - 16, boxH, 2, 2, "F");
      doc.setFillColor(15, 164, 169);
      doc.rect(margin + 8, innerY, 2.5, boxH, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("WHY THIS MATTERS", margin + 14, innerY + 4.5);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      let textY = innerY + 9;
      whyMattersLines.forEach((line: string) => {
        doc.text(line, margin + 14, textY);
        textY += 4.2;
      });

      innerY += boxH + 3.5;
    }

    // Expected Impact Box
    if (impactLines.length > 0) {
      const boxH = 7 + impactLines.length * 4.2;
      doc.setFillColor(240, 247, 255);
      doc.setDrawColor(208, 227, 255);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin + 8, innerY, contentWidth - 16, boxH, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text("EXPECTED IMPACT", margin + 12, innerY + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      let textY = innerY + 9;
      impactLines.forEach((line: string) => {
        doc.text(line, margin + 12, textY);
        textY += 4.2;
      });

      innerY += boxH + 3.5;
    }

    // Action Steps List
    if (actionStepLines.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text("Recommended Action Steps:", margin + 8, innerY + 1.5);
      innerY += 5;

      actionStepLines.forEach((lines) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 164, 169);
        doc.text("•", margin + 11, innerY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        lines.forEach((line) => {
          doc.text(line, margin + 16, innerY);
          innerY += 4.2;
        });
        innerY += 1;
      });
      innerY += 1.5;
    }

    // Expected 5-Year Changes List
    if (expectedChangeLines.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text("Expected Changes (5-Year Outlook):", margin + 8, innerY + 1.5);
      innerY += 5;

      expectedChangeLines.forEach((lines) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(59, 130, 246);
        doc.text("•", margin + 11, innerY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        lines.forEach((line) => {
          doc.text(line, margin + 16, innerY);
          innerY += 4.2;
        });
        innerY += 1;
      });
      innerY += 1.5;
    }

    currentY = cardStartY + cardH + 5;
  });

  // Add page footers to all pages
  const totalPages = (doc as any).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  // Save PDF file directly
  const sanitizedTitle = reportTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const fileName = `biovue_${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
