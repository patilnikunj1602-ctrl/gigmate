package com.gigmate.backend.services;

import com.gigmate.backend.models.Application;
import com.gigmate.backend.repositories.ApplicationRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final ApplicationRepository applicationRepository;

    public byte[] generateGigCertificate(String studentEmail, Long applicationId) throws Exception {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application record not found"));

        if (!app.getStudent().getEmail().equals(studentEmail)) {
            throw new RuntimeException("Unauthorized: This gig does not belong to you");
        }

        if (!"COMPLETED".equalsIgnoreCase(app.getStatus())) {
            throw new RuntimeException("Certificate unavailable: Gig status is " + app.getStatus());
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate()); // Landscape alignment for certificates
        PdfWriter.getInstance(document, out);

        document.open();

        // Styles & Typography
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, BaseColor.DARK_GRAY);
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 16, BaseColor.GRAY);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.BLACK);
        Font highlightFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLUE);

        // Certificate Framing Layout
        Paragraph titleSpace = new Paragraph("\nCERTIFICATE OF COMPLETION", titleFont);
        titleSpace.setAlignment(Element.ALIGN_CENTER);
        document.add(titleSpace);

        document.add(new Paragraph("\n", subTitleFont)); // Blank Separator Line

        Paragraph bodyText = new Paragraph();
        bodyText.setAlignment(Element.ALIGN_CENTER);
        bodyText.add(new Chunk("This document certifies that student account ", bodyFont));
        bodyText.add(new Chunk(app.getStudent().getName().toUpperCase(), highlightFont));
        bodyText.add(new Chunk(" has successfully fulfilled their performance contract requirements for the event position:\n\n", bodyFont));
        bodyText.add(new Chunk("\"" + app.getGig().getTitle() + "\"\n\n", highlightFont));
        bodyText.add(new Chunk("Organised by: " + app.getGig().getRecruiter().getName() + "\n", bodyFont));
        bodyText.add(new Chunk("Category Domain: " + app.getGig().getCategory() + "\n", subTitleFont));
        bodyText.add(new Chunk("Execution Date: " + app.getGig().getGigDate().toString() + "\n", bodyFont));
        document.add(bodyText);

        document.add(new Paragraph("\n\n\n\n", subTitleFont));

        Paragraph verificationFooter = new Paragraph("Platform Verified Digital Document - Secure GigMate Native Engine Verification via Core Backend API Auth Logs.", subTitleFont);
        verificationFooter.setAlignment(Element.ALIGN_CENTER);
        document.add(verificationFooter);

        document.close();
        return out.toByteArray();
    }
}
